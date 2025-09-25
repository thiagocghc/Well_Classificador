import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    matthews_corrcoef,
)

# === 1. Carregar o dataset ===
df = pd.read_csv("./sample_data/questoes_thiago_rotuladas_CoT_GPT5.csv")

# === 2. Verificar colunas obrigatórias ===
if "rotulo" not in df.columns or "classe" not in df.columns:
    raise ValueError("O arquivo CSV deve conter as colunas 'rotulo' (modelo) e 'classe' (especialista).")

# === 3. Definir as classes na ordem desejada ===
labels = ["ordenação", "agrupamento", "outros"]

y_true = df["classe"]
y_pred = df["rotulo"]

# === 4. Relatório de métricas ===
relatorio = classification_report(
    y_true,
    y_pred,
    labels=labels,
    digits=3,
    output_dict=True,
    zero_division=0,
)
relatorio_df = pd.DataFrame(relatorio).transpose()
relatorio_df.to_csv("./sample_data/relatorio_metricas.csv", encoding="utf-8-sig")

# === 4.1 Métricas globais adicionais ===
acuracia_geral = accuracy_score(y_true, y_pred)
mcc = matthews_corrcoef(y_true, y_pred)

# === 5. Matriz de confusão (contagens) ===
matriz = confusion_matrix(y_true, y_pred, labels=labels)
matriz_df = pd.DataFrame(
    matriz,
    index=[f"Real: {l}" for l in labels],
    columns=[f"Pred: {l}" for l in labels],
)
matriz_df.to_csv("./sample_data/matriz_confusao.csv", encoding="utf-8-sig")

# === 5.1 Matriz de confusão em porcentagem por linha (classe real) ===
row_sums = matriz.sum(axis=1, keepdims=True)
row_sums[row_sums == 0] = 1
matriz_pct = (matriz / row_sums) * 100.0
matriz_pct_df = pd.DataFrame(
    np.round(matriz_pct, 2),
    index=[f"Real: {l}" for l in labels],
    columns=[f"Pred: {l}" for l in labels],
)
matriz_pct_df.to_csv("./sample_data/matriz_confusao_percent.csv", encoding="utf-8-sig")

# === 5.2 % de acertos por classe (diagonal / total da classe real) ===
diag = np.diag(matriz)
totais_classe = matriz.sum(axis=1)
totais_classe = np.where(totais_classe == 0, 1, totais_classe)
acerto_por_classe = (diag / totais_classe) * 100.0
acertos_df = pd.DataFrame(
    {
        "classe": labels,
        "acertos_%": np.round(acerto_por_classe, 2),
        "acertos_abs": diag,
        "amostras": matriz.sum(axis=1),
    }
)
acertos_df.to_csv("./sample_data/acertos_por_classe.csv", index=False, encoding="utf-8-sig")

# === 6. Gráfico da matriz de confusão (cores em %) com contagem + % ===
annot = np.empty_like(matriz, dtype=object)
for i in range(matriz.shape[0]):
    for j in range(matriz.shape[1]):
        annot[i, j] = f"{matriz[i, j]}\n{matriz_pct[i, j]:.1f}%"

plt.figure(figsize=(8.5, 7))
sns.heatmap(
    matriz_pct,
    annot=annot,
    fmt="",
    cmap="Blues",
    xticklabels=labels,
    yticklabels=labels,
    cbar_kws={"label": "% dentro da classe real"},
    linewidths=0.5,
    linecolor="white",
)
plt.title("Matriz de Confusão (cores em %) — Modelo vs Especialista")
plt.xlabel("Previsto (modelo)")
plt.ylabel("Real (especialista)")
plt.tight_layout()
plt.savefig("./sample_data/matriz_confusao_grafico.png", dpi=200)
plt.show()

# === 7. Salvar erros de classificação ===
df_erros = df[df["rotulo"] != df["classe"]]
df_erros.to_csv("./sample_data/erros_classificacao.csv", index=False, encoding="utf-8-sig")

# === 8. Tabela-resumo para publicação (Acurácia, MCC, Macro-F1, Weighted-F1) ===
macro_f1 = relatorio_df.loc["macro avg", "f1-score"]
weighted_f1 = relatorio_df.loc["weighted avg", "f1-score"]

tabela_resumo = pd.DataFrame(
    {
        "Métrica": ["Acurácia", "MCC", "Macro-F1", "Weighted-F1"],
        "Valor": [acuracia_geral, mcc, macro_f1, weighted_f1],
    }
)
tabela_resumo.to_csv("./sample_data/tabela_resumo_metricas.csv", index=False, encoding="utf-8-sig")

# === 9. Gráfico de barras: F1 por classe ===
f1_por_classe = relatorio_df.loc[labels, "f1-score"].reset_index()
f1_por_classe.columns = ["classe", "f1_score"]
f1_por_classe.to_csv("./sample_data/f1_por_classe.csv", index=False, encoding="utf-8-sig")

plt.figure(figsize=(7.5, 5))
bars = plt.bar(f1_por_classe["classe"], f1_por_classe["f1_score"])
for b in bars:
    height = b.get_height()
    plt.text(b.get_x() + b.get_width()/2, height + 0.01, f"{height:.3f}", ha="center", va="bottom")
plt.ylim(0, 1.05)
plt.ylabel("F1-score")
plt.title("F1 por classe (Modelo vs Especialista)")
plt.tight_layout()
plt.savefig("./sample_data/f1_por_classe_bar.png", dpi=200)
plt.show()

# === 10. Relatório final no terminal ===
print("=== Relatório de Métricas ===")
print(relatorio_df.round(3))

print("\n=== Métricas globais ===")
print(f"Acurácia geral: {acuracia_geral:.4f} ({acuracia_geral*100:.2f}%)")
print(f"MCC (Matthews): {mcc:.4f}")
print(f"Macro-F1: {macro_f1:.4f} | Weighted-F1: {weighted_f1:.4f}")

print("\n=== Tabela-resumo ===")
print(tabela_resumo)

print("\n=== Matriz de Confusão (contagens) ===")
print(matriz_df)

print("\n=== Matriz de Confusão (% por classe real) ===")
print(matriz_pct_df)

print("\n=== % de acertos por classe ===")
print(acertos_df)

print(f"\nTotal de erros encontrados: {len(df_erros)}")