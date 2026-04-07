const SECTIONS = [
  {
    id: "python",
    title: "Python for Data Science",
    phase: "Phase 1 · Days 1–5",
    color: "#60a5fa",
    skills: [
      {
        id: "py_01",
        name: "NumPy — arrays, broadcasting, vectorised operations",
        desc: "Foundation for all numerical computing in Python",
        tag: "core",
        resources: [
          { name: "NumPy Official Quickstart", platform: "numpy.org", url: "https://numpy.org/doc/stable/user/quickstart.html", icon: "NP" },
          { name: "NumPy in 60 Minutes", platform: "YouTube · freeCodeCamp", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", icon: "YT" },
          { name: "Kaggle Python + NumPy", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/python", icon: "KG" }
        ]
      },
      {
        id: "py_02",
        name: "Pandas — DataFrames, groupby, merge, apply, pivot",
        desc: "Most-used library in every DS job",
        tag: "core",
        resources: [
          { name: "Pandas Official Getting Started", platform: "pandas.pydata.org", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/", icon: "PD" },
          { name: "Kaggle Pandas Course", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/pandas", icon: "KG" },
          { name: "Pandas in 1 Hour — Tech With Tim", platform: "YouTube", url: "https://www.youtube.com/watch?v=vmEHCJofslg", icon: "YT" }
        ]
      },
      {
        id: "py_03",
        name: "Matplotlib & Seaborn — plots, heatmaps, distributions",
        desc: "Core visualisation stack",
        tag: "core",
        resources: [
          { name: "Matplotlib Official Tutorials", platform: "matplotlib.org", url: "https://matplotlib.org/stable/tutorials/index.html", icon: "MP" },
          { name: "Seaborn Official Tutorial", platform: "seaborn.pydata.org", url: "https://seaborn.pydata.org/tutorial.html", icon: "SB" },
          { name: "Kaggle Data Visualisation", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/data-visualization", icon: "KG" }
        ]
      },
      {
        id: "py_04",
        name: "Plotly — interactive visualisations & dashboards",
        desc: "For building shareable interactive charts",
        tag: "advanced",
        resources: [
          { name: "Plotly Python Open Source", platform: "plotly.com (free)", url: "https://plotly.com/python/", icon: "PL" },
          { name: "Plotly Dash Tutorial", platform: "YouTube · Charming Data", url: "https://www.youtube.com/watch?v=hSPmj7mK6ng", icon: "YT" }
        ]
      },
      {
        id: "py_05",
        name: "Python OOP — classes, inheritance, dunder methods",
        desc: "Needed for building ML pipelines & custom estimators",
        tag: "core",
        resources: [
          { name: "Python OOP — Corey Schafer", platform: "YouTube (free)", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeZtO", icon: "YT" },
          { name: "Real Python — OOP in Python", platform: "realpython.com (free)", url: "https://realpython.com/python3-object-oriented-programming/", icon: "RP" }
        ]
      },
      {
        id: "py_06",
        name: "List comprehensions, generators, decorators, context managers",
        desc: "Write Pythonic, efficient code",
        tag: "core",
        resources: [
          { name: "Python Tips & Tricks — freeCodeCamp", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=rrCmkFD5MHQ", icon: "YT" },
          { name: "Fluent Python concepts (free excerpts)", platform: "realpython.com", url: "https://realpython.com/python-generators/", icon: "RP" }
        ]
      },
      {
        id: "py_07",
        name: "Virtual environments — pip, conda, poetry",
        desc: "Professional Python project setup",
        tag: "core",
        resources: [
          { name: "Python Environments — Real Python", platform: "realpython.com (free)", url: "https://realpython.com/python-virtual-environments-a-primer/", icon: "RP" }
        ]
      },
      {
        id: "py_08",
        name: "Jupyter Notebooks — clean, reproducible notebook discipline",
        desc: "How you present your work matters",
        tag: "core",
        resources: [
          { name: "Jupyter Official Documentation", platform: "jupyter.org (free)", url: "https://jupyter-notebook.readthedocs.io/en/stable/", icon: "JP" },
          { name: "Kaggle Notebooks (free cloud environment)", platform: "Kaggle", url: "https://www.kaggle.com/code", icon: "KG" }
        ]
      }
    ]
  },
  {
    id: "sql",
    title: "SQL & Databases",
    phase: "Phase 1 · Days 4–7",
    color: "#34d399",
    skills: [
      {
        id: "sql_01",
        name: "SELECT, WHERE, GROUP BY, HAVING, ORDER BY",
        desc: "Absolute basics — must be fluent",
        tag: "core",
        resources: [
          { name: "Mode SQL Tutorial", platform: "mode.com (free)", url: "https://mode.com/sql-tutorial/", icon: "MD" },
          { name: "SQLZoo Interactive", platform: "sqlzoo.net (free)", url: "https://sqlzoo.net/", icon: "SZ" },
          { name: "Kaggle Intro to SQL", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/intro-to-sql", icon: "KG" }
        ]
      },
      {
        id: "sql_02",
        name: "JOINs — INNER, LEFT, RIGHT, FULL OUTER, SELF, CROSS",
        desc: "Top interview topic — every DS interview has JOIN questions",
        tag: "core",
        resources: [
          { name: "Visual JOIN explanation", platform: "sql-joins.leopard.in.ua", url: "https://sql-joins.leopard.in.ua/", icon: "VJ" },
          { name: "Advanced SQL — Kaggle", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/advanced-sql", icon: "KG" }
        ]
      },
      {
        id: "sql_03",
        name: "Window functions — ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE",
        desc: "Separates junior from mid-level in interviews",
        tag: "core",
        resources: [
          { name: "Mode SQL Window Functions", platform: "mode.com (free)", url: "https://mode.com/sql-tutorial/sql-window-functions/", icon: "MD" },
          { name: "Window Functions — Kaggle Advanced SQL", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/advanced-sql", icon: "KG" }
        ]
      },
      {
        id: "sql_04",
        name: "CTEs and subqueries — WITH clause, correlated subqueries",
        desc: "Clean, readable complex queries",
        tag: "core",
        resources: [
          { name: "CTEs in SQL — Mode", platform: "mode.com (free)", url: "https://mode.com/sql-tutorial/sql-with-statement/", icon: "MD" }
        ]
      },
      {
        id: "sql_05",
        name: "Aggregations, date functions, string functions",
        desc: "Day-to-day data wrangling in SQL",
        tag: "core",
        resources: [
          { name: "LeetCode SQL (free tier)", platform: "LeetCode", url: "https://leetcode.com/problemset/database/", icon: "LC" },
          { name: "HackerRank SQL (free)", platform: "HackerRank", url: "https://www.hackerrank.com/domains/sql", icon: "HR" }
        ]
      },
      {
        id: "sql_06",
        name: "Query optimisation — indexes, EXPLAIN, query plans",
        desc: "Senior-level SQL knowledge",
        tag: "advanced",
        resources: [
          { name: "Use The Index, Luke (free book)", platform: "use-the-index-luke.com", url: "https://use-the-index-luke.com/", icon: "UI" }
        ]
      },
      {
        id: "sql_07",
        name: "NoSQL basics — MongoDB, document model, when to use",
        desc: "Awareness level needed for ML pipelines",
        tag: "advanced",
        resources: [
          { name: "MongoDB University (free courses)", platform: "learn.mongodb.com", url: "https://learn.mongodb.com/", icon: "MG" }
        ]
      }
    ]
  },
  {
    id: "stats",
    title: "Statistics & Probability",
    phase: "Phase 1 · Days 5–10",
    color: "#a78bfa",
    skills: [
      {
        id: "st_01",
        name: "Descriptive statistics — mean, median, variance, std, IQR, skewness, kurtosis",
        desc: "Foundational — comes up everywhere",
        tag: "core",
        resources: [
          { name: "Khan Academy Statistics (free)", platform: "khanacademy.org", url: "https://www.khanacademy.org/math/statistics-probability", icon: "KA" },
          { name: "StatQuest — Statistics Fundamentals", platform: "YouTube (free)", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", icon: "YT" }
        ]
      },
      {
        id: "st_02",
        name: "Probability distributions — Normal, Binomial, Poisson, Uniform, Exponential",
        desc: "Core for ML theory and interviews",
        tag: "core",
        resources: [
          { name: "StatQuest Distributions playlist", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=iYiOVISWXS4", icon: "YT" },
          { name: "Khan Academy Probability", platform: "khanacademy.org (free)", url: "https://www.khanacademy.org/math/statistics-probability/probability-library", icon: "KA" }
        ]
      },
      {
        id: "st_03",
        name: "Central Limit Theorem — sampling distributions, standard error",
        desc: "Critical for understanding ML evaluation",
        tag: "core",
        resources: [
          { name: "StatQuest CLT (10 min)", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=YAlJCEDH2uY", icon: "YT" }
        ]
      },
      {
        id: "st_04",
        name: "Hypothesis testing — t-test, chi-square, ANOVA, Mann-Whitney",
        desc: "A/B testing backbone — every product DS role",
        tag: "core",
        resources: [
          { name: "StatQuest Hypothesis Testing", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=0oc49DyA3hU", icon: "YT" },
          { name: "Khan Academy Significance Tests", platform: "khanacademy.org (free)", url: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample", icon: "KA" }
        ]
      },
      {
        id: "st_05",
        name: "p-values, confidence intervals, Type I/II errors, statistical power",
        desc: "Misunderstood by most — master this",
        tag: "core",
        resources: [
          { name: "StatQuest p-values", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=vemZtEM63GY", icon: "YT" }
        ]
      },
      {
        id: "st_06",
        name: "Bayesian statistics — Bayes' theorem, priors, posteriors, likelihood",
        desc: "Increasingly important in modern ML",
        tag: "core",
        resources: [
          { name: "3Blue1Brown — Bayes Theorem", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=HZGCoVF3YvM", icon: "YT" },
          { name: "Probabilistic Programming & Bayesian Methods (free book)", platform: "camdavidsonpilon.github.io", url: "https://github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers", icon: "GH" }
        ]
      },
      {
        id: "st_07",
        name: "A/B testing — experiment design, sample size, MDE, multivariate",
        desc: "Top DS interview topic at product companies",
        tag: "hot",
        resources: [
          { name: "Evan Miller Sample Size Calculator + Theory", platform: "evanmiller.org (free)", url: "https://www.evanmiller.org/ab-testing/", icon: "EM" },
          { name: "Udacity A/B Testing Free Course", platform: "Udacity (free)", url: "https://www.udacity.com/course/ab-testing--ud257", icon: "UD" }
        ]
      },
      {
        id: "st_08",
        name: "Correlation vs causation — Simpson's paradox, confounders",
        desc: "Critical thinking for data analysis",
        tag: "core",
        resources: [
          { name: "Calling Bullshit — free lecture series", platform: "callingbullshit.org (free)", url: "https://www.callingbullshit.org/videos.html", icon: "CB" }
        ]
      }
    ]
  },
  {
    id: "math",
    title: "Math for ML — Linear Algebra & Calculus",
    phase: "Phase 1 · Days 6–10",
    color: "#f472b6",
    skills: [
      {
        id: "ma_01",
        name: "Vectors, dot products, norms, cosine similarity",
        desc: "Embeddings, NLP, and recommenders all use this",
        tag: "core",
        resources: [
          { name: "3Blue1Brown — Essence of Linear Algebra", platform: "YouTube (free)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", icon: "YT" },
          { name: "Khan Academy Linear Algebra", platform: "khanacademy.org (free)", url: "https://www.khanacademy.org/math/linear-algebra", icon: "KA" }
        ]
      },
      {
        id: "ma_02",
        name: "Matrices — multiplication, transpose, inverse, rank, determinant",
        desc: "Core to all ML math",
        tag: "core",
        resources: [
          { name: "3Blue1Brown Linear Algebra series", platform: "YouTube (free)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", icon: "YT" }
        ]
      },
      {
        id: "ma_03",
        name: "Eigenvalues & eigenvectors — PCA intuition",
        desc: "Needed to truly understand PCA and SVD",
        tag: "core",
        resources: [
          { name: "3Blue1Brown Eigenvalues", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=PFDu9oVAE-g", icon: "YT" },
          { name: "StatQuest PCA step-by-step", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ", icon: "YT" }
        ]
      },
      {
        id: "ma_04",
        name: "Derivatives, partial derivatives, chain rule",
        desc: "Backpropagation is just chain rule",
        tag: "core",
        resources: [
          { name: "3Blue1Brown — Essence of Calculus", platform: "YouTube (free)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", icon: "YT" }
        ]
      },
      {
        id: "ma_05",
        name: "Gradient vectors, Jacobian, Hessian",
        desc: "Understand optimisation deeply",
        tag: "advanced",
        resources: [
          { name: "Mathematics for Machine Learning (free textbook)", platform: "mml-book.github.io", url: "https://mml-book.github.io/", icon: "BK" }
        ]
      },
      {
        id: "ma_06",
        name: "Convexity, loss landscapes, saddle points",
        desc: "Why some problems optimise easily, others don't",
        tag: "advanced",
        resources: [
          { name: "CS229 Notes — Andrew Ng (free)", platform: "cs229.stanford.edu", url: "https://cs229.stanford.edu/main_notes.pdf", icon: "ST" }
        ]
      }
    ]
  },
  {
    id: "eda",
    title: "Data Wrangling & EDA",
    phase: "Phase 2 · Days 11–14",
    color: "#fbbf24",
    skills: [
      {
        id: "ed_01",
        name: "Missing value analysis — patterns, MCAR/MAR/MNAR, imputation strategies",
        desc: "Real data is always dirty",
        tag: "core",
        resources: [
          { name: "Kaggle Data Cleaning Course (free)", platform: "Kaggle Learn", url: "https://www.kaggle.com/learn/data-cleaning", icon: "KG" }
        ]
      },
      {
        id: "ed_02",
        name: "Outlier detection — IQR, Z-score, isolation forest, visual methods",
        desc: "Crucial for model performance",
        tag: "core",
        resources: [
          { name: "Kaggle Data Cleaning", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/data-cleaning", icon: "KG" }
        ]
      },
      {
        id: "ed_03",
        name: "Feature distributions — skewness, log transforms, Box-Cox",
        desc: "Many models assume normality",
        tag: "core",
        resources: [
          { name: "Feature Engineering for ML — Kaggle", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/feature-engineering", icon: "KG" }
        ]
      },
      {
        id: "ed_04",
        name: "Correlation analysis — Pearson, Spearman, Cramér's V",
        desc: "Feature selection and understanding data",
        tag: "core",
        resources: [
          { name: "StatQuest Correlation", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=xZ_z8KWkhXE", icon: "YT" }
        ]
      },
      {
        id: "ed_05",
        name: "Feature engineering — binning, target encoding, interaction features, datetime features",
        desc: "Often more impactful than model choice",
        tag: "core",
        resources: [
          { name: "Feature Engineering — Kaggle Learn (free)", platform: "Kaggle Learn", url: "https://www.kaggle.com/learn/feature-engineering", icon: "KG" },
          { name: "H2O Feature Engineering (free)", platform: "h2o.ai (free)", url: "https://www.h2o.ai/resources/", icon: "H2" }
        ]
      },
      {
        id: "ed_06",
        name: "Feature scaling — StandardScaler, MinMaxScaler, RobustScaler",
        desc: "Required for distance-based and gradient methods",
        tag: "core",
        resources: [
          { name: "Scikit-learn Preprocessing Guide", platform: "scikit-learn.org (free)", url: "https://scikit-learn.org/stable/modules/preprocessing.html", icon: "SK" }
        ]
      },
      {
        id: "ed_07",
        name: "Encoding — OneHot, Label, Target, Binary, Ordinal",
        desc: "Handling categorical variables correctly",
        tag: "core",
        resources: [
          { name: "Category Encoders library docs (free)", platform: "contrib.scikit-learn.org", url: "https://contrib.scikit-learn.org/category_encoders/", icon: "SK" }
        ]
      }
    ]
  },
  {
    id: "ml_core",
    title: "Core Machine Learning Algorithms",
    phase: "Phase 2 · Days 11–22",
    color: "#f87171",
    skills: [
      {
        id: "ml_01",
        name: "Linear regression — OLS, assumptions, R², adjusted R², multicollinearity",
        desc: "Most-asked regression topic in interviews",
        tag: "core",
        resources: [
          { name: "StatQuest Linear Regression", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=nk2CQITm_eo", icon: "YT" },
          { name: "Andrew Ng ML Course (free audit)", platform: "Coursera / DeepLearning.AI", url: "https://www.coursera.org/learn/machine-learning", icon: "CO" }
        ]
      },
      {
        id: "ml_02",
        name: "Logistic regression — sigmoid, log-loss, odds ratio, decision boundary",
        desc: "Most-asked classification baseline",
        tag: "core",
        resources: [
          { name: "StatQuest Logistic Regression", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=yIYKR4sgzI8", icon: "YT" }
        ]
      },
      {
        id: "ml_03",
        name: "Decision trees — Gini impurity, entropy, information gain, pruning",
        desc: "Foundation for ensemble methods",
        tag: "core",
        resources: [
          { name: "StatQuest Decision Trees", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=7VeUPuFGJHk", icon: "YT" }
        ]
      },
      {
        id: "ml_04",
        name: "Random Forest — bagging, feature importance, OOB error",
        desc: "Industry workhorse — know it deeply",
        tag: "core",
        resources: [
          { name: "StatQuest Random Forest", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ", icon: "YT" }
        ]
      },
      {
        id: "ml_05",
        name: "Gradient Boosting — XGBoost, LightGBM, CatBoost — theory + practice",
        desc: "Wins most tabular ML competitions",
        tag: "core",
        resources: [
          { name: "StatQuest Gradient Boosting", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=3CC4N4z3GJc", icon: "YT" },
          { name: "XGBoost Documentation (free)", platform: "xgboost.readthedocs.io", url: "https://xgboost.readthedocs.io/en/latest/tutorials/model.html", icon: "XG" },
          { name: "Kaggle Intermediate ML (trees)", platform: "Kaggle Learn (free)", url: "https://www.kaggle.com/learn/intermediate-machine-learning", icon: "KG" }
        ]
      },
      {
        id: "ml_06",
        name: "SVM — margin, kernel trick (RBF, polynomial), support vectors",
        desc: "Theory is heavily tested in interviews",
        tag: "core",
        resources: [
          { name: "StatQuest SVM", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=efR1C6CvhmE", icon: "YT" }
        ]
      },
      {
        id: "ml_07",
        name: "KNN — distance metrics (Euclidean, Manhattan, cosine), curse of dimensionality",
        desc: "Simple but conceptually important",
        tag: "core",
        resources: [
          { name: "StatQuest KNN", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=HVXime0nQeI", icon: "YT" }
        ]
      },
      {
        id: "ml_08",
        name: "Naive Bayes — Gaussian, Multinomial, Bernoulli — text classification",
        desc: "Fast baseline for NLP classification",
        tag: "core",
        resources: [
          { name: "StatQuest Naive Bayes", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=O2L2Uv9pdDA", icon: "YT" }
        ]
      },
      {
        id: "ml_09",
        name: "K-Means clustering — inertia, elbow method, k-means++",
        desc: "Most common unsupervised algorithm",
        tag: "core",
        resources: [
          { name: "StatQuest K-Means", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=4b5d3muPQmA", icon: "YT" }
        ]
      },
      {
        id: "ml_10",
        name: "DBSCAN — density-based clustering, epsilon, min_samples, noise points",
        desc: "Better than K-Means for non-spherical clusters",
        tag: "core",
        resources: [
          { name: "Scikit-learn DBSCAN Guide", platform: "scikit-learn.org (free)", url: "https://scikit-learn.org/stable/modules/clustering.html#dbscan", icon: "SK" }
        ]
      },
      {
        id: "ml_11",
        name: "PCA — dimensionality reduction, explained variance, scree plot",
        desc: "Fundamental for high-dim data",
        tag: "core",
        resources: [
          { name: "StatQuest PCA", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ", icon: "YT" }
        ]
      },
      {
        id: "ml_12",
        name: "t-SNE & UMAP — non-linear dimensionality reduction, visualisation",
        desc: "Used to visualise embeddings",
        tag: "core",
        resources: [
          { name: "StatQuest t-SNE", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=NEaUSP4YerM", icon: "YT" },
          { name: "UMAP documentation (free)", platform: "umap-learn.readthedocs.io", url: "https://umap-learn.readthedocs.io/en/latest/basic_usage.html", icon: "UM" }
        ]
      },
      {
        id: "ml_13",
        name: "Bias-variance tradeoff — underfitting, overfitting, the sweet spot",
        desc: "Conceptual core of all of ML",
        tag: "core",
        resources: [
          { name: "StatQuest Bias & Variance", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=EuBBz3bI-aA", icon: "YT" }
        ]
      },
      {
        id: "ml_14",
        name: "Cross-validation — k-fold, stratified k-fold, leave-one-out, time-series CV",
        desc: "Non-negotiable for reliable model evaluation",
        tag: "core",
        resources: [
          { name: "Scikit-learn CV Guide", platform: "scikit-learn.org (free)", url: "https://scikit-learn.org/stable/modules/cross_validation.html", icon: "SK" }
        ]
      },
      {
        id: "ml_15",
        name: "Evaluation metrics — Accuracy, Precision, Recall, F1, ROC-AUC, PR curve, RMSE, MAE, MAPE",
        desc: "Know when to use which metric — interview favourite",
        tag: "core",
        resources: [
          { name: "Google ML Crash Course — Metrics", platform: "Google (free)", url: "https://developers.google.com/machine-learning/crash-course/classification/accuracy", icon: "GG" }
        ]
      },
      {
        id: "ml_16",
        name: "Handling class imbalance — SMOTE, class weights, oversampling, undersampling",
        desc: "Real datasets are always imbalanced",
        tag: "core",
        resources: [
          { name: "imbalanced-learn documentation (free)", platform: "imbalanced-learn.org", url: "https://imbalanced-learn.org/stable/user_guide.html", icon: "IL" }
        ]
      },
      {
        id: "ml_17",
        name: "Hyperparameter tuning — GridSearchCV, RandomizedSearchCV, Optuna, Bayesian optimisation",
        desc: "Getting max performance from models",
        tag: "core",
        resources: [
          { name: "Optuna Quick Start (free)", platform: "optuna.readthedocs.io", url: "https://optuna.readthedocs.io/en/stable/tutorial/10_key_features/001_first.html", icon: "OP" },
          { name: "Scikit-learn Model Selection", platform: "scikit-learn.org (free)", url: "https://scikit-learn.org/stable/modules/grid_search.html", icon: "SK" }
        ]
      },
      {
        id: "ml_18",
        name: "Scikit-learn Pipelines — ColumnTransformer, Pipeline, custom transformers",
        desc: "Production-grade ML code",
        tag: "hot",
        resources: [
          { name: "Scikit-learn Pipeline Guide", platform: "scikit-learn.org (free)", url: "https://scikit-learn.org/stable/modules/compose.html", icon: "SK" }
        ]
      },
      {
        id: "ml_19",
        name: "Recommender Systems — collaborative filtering, content-based, matrix factorisation",
        desc: "Huge category in industry DS roles",
        tag: "advanced",
        resources: [
          { name: "Surprise Library — RecSys (free)", platform: "surpriselib.com", url: "http://surpriselib.com/", icon: "SR" },
          { name: "Fast.ai Collaborative Filtering", platform: "course.fast.ai (free)", url: "https://course.fast.ai/", icon: "FA" }
        ]
      },
      {
        id: "ml_20",
        name: "Time series — ARIMA, SARIMA, Prophet, trend/seasonality decomposition",
        desc: "Huge in fintech, retail, operations roles",
        tag: "advanced",
        resources: [
          { name: "Kaggle Time Series Course (free)", platform: "Kaggle Learn", url: "https://www.kaggle.com/learn/time-series", icon: "KG" },
          { name: "Prophet documentation (free)", platform: "facebook.github.io/prophet", url: "https://facebook.github.io/prophet/docs/quick_start.html", icon: "PR" }
        ]
      }
    ]
  },
  {
    id: "dl",
    title: "Deep Learning",
    phase: "Phase 3 · Days 23–30",
    color: "#f59e0b",
    skills: [
      {
        id: "dl_01",
        name: "Neural network fundamentals — perceptron, activation functions (ReLU, sigmoid, softmax, GELU)",
        desc: "Build from scratch at least once",
        tag: "core",
        resources: [
          { name: "Andrej Karpathy — Neural Nets Zero to Hero", platform: "YouTube (free)", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", icon: "YT" },
          { name: "fast.ai Practical Deep Learning (free)", platform: "course.fast.ai", url: "https://course.fast.ai/", icon: "FA" }
        ]
      },
      {
        id: "dl_02",
        name: "Backpropagation — chain rule, computational graphs, vanishing gradients",
        desc: "Every DL interview starts here",
        tag: "core",
        resources: [
          { name: "Andrej Karpathy — micrograd walkthrough", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=VMj-3S1tku0", icon: "YT" },
          { name: "3Blue1Brown Backprop", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", icon: "YT" }
        ]
      },
      {
        id: "dl_03",
        name: "Optimisers — SGD, Momentum, AdaGrad, RMSProp, Adam, AdamW",
        desc: "Why Adam is the default and when it isn't",
        tag: "core",
        resources: [
          { name: "Sebastian Ruder — Optimizer Overview (free blog)", platform: "ruder.io", url: "https://www.ruder.io/optimizing-gradient-descent/", icon: "BL" }
        ]
      },
      {
        id: "dl_04",
        name: "Regularisation — Dropout, BatchNorm, LayerNorm, L1/L2 weight decay",
        desc: "Prevent overfitting in deep networks",
        tag: "core",
        resources: [
          { name: "fast.ai Deep Learning Part 1", platform: "course.fast.ai (free)", url: "https://course.fast.ai/", icon: "FA" }
        ]
      },
      {
        id: "dl_05",
        name: "CNNs — convolution, pooling, stride, padding, receptive field, ResNet, EfficientNet",
        desc: "Foundation of all computer vision",
        tag: "core",
        resources: [
          { name: "CS231n CNN notes (free)", platform: "cs231n.github.io", url: "https://cs231n.github.io/convolutional-networks/", icon: "ST" },
          { name: "fast.ai Vision (free)", platform: "course.fast.ai", url: "https://course.fast.ai/", icon: "FA" }
        ]
      },
      {
        id: "dl_06",
        name: "RNNs, LSTMs, GRUs — sequence modelling, vanishing gradient, cell state",
        desc: "Foundation before transformers",
        tag: "core",
        resources: [
          { name: "Colah's LSTM blog (free, legendary)", platform: "colah.github.io", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", icon: "BL" }
        ]
      },
      {
        id: "dl_07",
        name: "Transformer architecture — self-attention, multi-head attention, positional encoding, encoder-decoder",
        desc: "The most important architecture in modern AI",
        tag: "hot",
        resources: [
          { name: "Illustrated Transformer (free blog)", platform: "jalammar.github.io", url: "https://jalammar.github.io/illustrated-transformer/", icon: "BL" },
          { name: "Andrej Karpathy GPT from scratch", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", icon: "YT" },
          { name: "Attention Is All You Need (original paper)", platform: "arxiv.org (free)", url: "https://arxiv.org/abs/1706.03762", icon: "AX" }
        ]
      },
      {
        id: "dl_08",
        name: "PyTorch — tensors, autograd, nn.Module, DataLoader, training loop, GPU usage",
        desc: "Standard deep learning framework for research and industry",
        tag: "core",
        resources: [
          { name: "PyTorch Official Tutorials (free)", platform: "pytorch.org", url: "https://pytorch.org/tutorials/beginner/basics/intro.html", icon: "PT" },
          { name: "fast.ai (built on PyTorch) — free", platform: "course.fast.ai", url: "https://course.fast.ai/", icon: "FA" }
        ]
      },
      {
        id: "dl_09",
        name: "Transfer learning & fine-tuning — pretrained models, frozen layers, feature extraction vs fine-tune",
        desc: "How all production DL actually works",
        tag: "hot",
        resources: [
          { name: "fast.ai Transfer Learning", platform: "course.fast.ai (free)", url: "https://course.fast.ai/", icon: "FA" },
          { name: "HuggingFace Fine-tuning Guide", platform: "huggingface.co (free)", url: "https://huggingface.co/docs/transformers/training", icon: "HF" }
        ]
      },
      {
        id: "dl_10",
        name: "Learning rate schedulers — warmup, cosine decay, OneCycleLR",
        desc: "Makes or breaks large model training",
        tag: "advanced",
        resources: [
          { name: "PyTorch LR Scheduler Docs", platform: "pytorch.org (free)", url: "https://pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate", icon: "PT" }
        ]
      },
      {
        id: "dl_11",
        name: "Mixed precision training (FP16/BF16) — memory efficiency, torch.cuda.amp",
        desc: "Train larger models on limited GPU",
        tag: "advanced",
        resources: [
          { name: "PyTorch AMP Tutorial (free)", platform: "pytorch.org", url: "https://pytorch.org/tutorials/recipes/recipes/amp_recipe.html", icon: "PT" }
        ]
      }
    ]
  },
  {
    id: "nlp",
    title: "NLP — Natural Language Processing",
    phase: "Phase 3 · Days 26–33",
    color: "#34d399",
    skills: [
      {
        id: "nl_01",
        name: "Text preprocessing — tokenisation, stemming, lemmatisation, stopwords, regex",
        desc: "Classic NLP pipeline",
        tag: "core",
        resources: [
          { name: "NLTK official book (free)", platform: "nltk.org/book", url: "https://www.nltk.org/book/", icon: "NL" },
          { name: "spaCy course (free)", platform: "spacy.io", url: "https://course.spacy.io/", icon: "SP" }
        ]
      },
      {
        id: "nl_02",
        name: "TF-IDF, Bag of Words, n-grams — classical text features",
        desc: "Baseline for text classification",
        tag: "core",
        resources: [
          { name: "Scikit-learn text feature extraction", platform: "scikit-learn.org (free)", url: "https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction", icon: "SK" }
        ]
      },
      {
        id: "nl_03",
        name: "Word embeddings — Word2Vec, GloVe, FastText",
        desc: "Bridge between classical and modern NLP",
        tag: "core",
        resources: [
          { name: "CS224N Word Vectors lecture (free)", platform: "web.stanford.edu", url: "https://web.stanford.edu/class/cs224n/", icon: "ST" },
          { name: "Jay Alammar Word2Vec illustrated", platform: "jalammar.github.io (free)", url: "https://jalammar.github.io/illustrated-word2vec/", icon: "BL" }
        ]
      },
      {
        id: "nl_04",
        name: "HuggingFace Transformers — BERT, RoBERTa, DistilBERT, T5, GPT-2 for classification & generation",
        desc: "Industry standard for all NLP tasks",
        tag: "hot",
        resources: [
          { name: "HuggingFace NLP Course (free)", platform: "huggingface.co/learn", url: "https://huggingface.co/learn/nlp-course/", icon: "HF" },
          { name: "Illustrated BERT", platform: "jalammar.github.io (free)", url: "https://jalammar.github.io/illustrated-bert/", icon: "BL" }
        ]
      },
      {
        id: "nl_05",
        name: "Named Entity Recognition, POS tagging, dependency parsing",
        desc: "Information extraction tasks",
        tag: "core",
        resources: [
          { name: "spaCy NER tutorial (free)", platform: "spacy.io", url: "https://spacy.io/usage/linguistic-features", icon: "SP" }
        ]
      },
      {
        id: "nl_06",
        name: "Sentence transformers & semantic search — bi-encoders, cross-encoders",
        desc: "Core of all semantic search and RAG",
        tag: "hot",
        resources: [
          { name: "SBERT documentation (free)", platform: "sbert.net", url: "https://www.sbert.net/", icon: "SB" }
        ]
      },
      {
        id: "nl_07",
        name: "Text summarisation, translation, question answering with T5/BART",
        desc: "Seq2seq tasks — growing in industry",
        tag: "hot",
        resources: [
          { name: "HuggingFace Tasks (free)", platform: "huggingface.co", url: "https://huggingface.co/tasks", icon: "HF" }
        ]
      }
    ]
  },
  {
    id: "cv",
    title: "Computer Vision",
    phase: "Phase 3 · Days 26–33",
    color: "#60a5fa",
    skills: [
      {
        id: "cv_01",
        name: "Image classification — torchvision, ImageNet, top-1/top-5 accuracy",
        desc: "Entry point for CV",
        tag: "core",
        resources: [
          { name: "fast.ai Vision Part 1 (free)", platform: "course.fast.ai", url: "https://course.fast.ai/", icon: "FA" },
          { name: "PyTorch Image Classification Tutorial", platform: "pytorch.org (free)", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", icon: "PT" }
        ]
      },
      {
        id: "cv_02",
        name: "Object detection — YOLO, Faster R-CNN, anchor boxes, NMS",
        desc: "Industrial CV applications",
        tag: "advanced",
        resources: [
          { name: "Ultralytics YOLO docs (free)", platform: "docs.ultralytics.com", url: "https://docs.ultralytics.com/", icon: "YL" }
        ]
      },
      {
        id: "cv_03",
        name: "Image segmentation — semantic vs instance, U-Net, Mask R-CNN",
        desc: "Medical imaging, autonomous vehicles",
        tag: "advanced",
        resources: [
          { name: "Albumentations tutorial (free)", platform: "albumentations.ai", url: "https://albumentations.ai/docs/", icon: "AB" }
        ]
      },
      {
        id: "cv_04",
        name: "Data augmentation — albumentations, torchvision transforms, mixup, cutmix",
        desc: "Critical for CV model generalisation",
        tag: "core",
        resources: [
          { name: "Albumentations documentation (free)", platform: "albumentations.ai", url: "https://albumentations.ai/docs/", icon: "AB" }
        ]
      },
      {
        id: "cv_05",
        name: "Vision Transformers (ViT) — patch embeddings, class token, comparison to CNNs",
        desc: "State of the art in CV",
        tag: "hot",
        resources: [
          { name: "ViT paper explained — Yannic Kilcher", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=TrdevFK_am4", icon: "YT" }
        ]
      }
    ]
  },
  {
    id: "genai",
    title: "Generative AI & LLMs",
    phase: "Phase 3 · Days 30–38",
    color: "#c084fc",
    skills: [
      {
        id: "ga_01",
        name: "LLM fundamentals — GPT architecture, tokenisation (BPE), context window, temperature, top-p",
        desc: "Core concepts every ML engineer needs now",
        tag: "hot",
        resources: [
          { name: "Andrej Karpathy GPT from scratch (free)", platform: "YouTube", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", icon: "YT" },
          { name: "Let's build the GPT tokeniser — Karpathy", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=zduSFxRajkE", icon: "YT" }
        ]
      },
      {
        id: "ga_02",
        name: "Prompt engineering — zero-shot, few-shot, chain-of-thought, system prompts, ReAct",
        desc: "Immediately employable skill",
        tag: "hot",
        resources: [
          { name: "Anthropic Prompt Engineering Guide (free)", platform: "docs.anthropic.com", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", icon: "AN" },
          { name: "OpenAI Prompt Engineering Guide (free)", platform: "platform.openai.com", url: "https://platform.openai.com/docs/guides/prompt-engineering", icon: "OA" },
          { name: "DAIR.AI Prompt Engineering Guide (free)", platform: "promptingguide.ai", url: "https://www.promptingguide.ai/", icon: "PE" }
        ]
      },
      {
        id: "ga_03",
        name: "RAG — Retrieval-Augmented Generation — chunking, embeddings, vector search, reranking",
        desc: "Most deployed GenAI pattern in production",
        tag: "hot",
        resources: [
          { name: "LangChain RAG Tutorial (free)", platform: "python.langchain.com", url: "https://python.langchain.com/docs/tutorials/rag/", icon: "LC" },
          { name: "LlamaIndex RAG documentation (free)", platform: "docs.llamaindex.ai", url: "https://docs.llamaindex.ai/en/stable/", icon: "LI" }
        ]
      },
      {
        id: "ga_04",
        name: "Fine-tuning LLMs — full fine-tuning, LoRA, QLoRA, instruction tuning, RLHF basics",
        desc: "Highly in-demand — very few people can do this",
        tag: "hot",
        resources: [
          { name: "HuggingFace PEFT / LoRA guide (free)", platform: "huggingface.co", url: "https://huggingface.co/docs/peft/conceptual_guides/lora", icon: "HF" },
          { name: "Axolotl fine-tuning (free, open source)", platform: "github.com/OpenAccess-AI", url: "https://github.com/axolotl-ai-cloud/axolotl", icon: "GH" }
        ]
      },
      {
        id: "ga_05",
        name: "LangChain — chains, agents, tools, memory, document loaders",
        desc: "Most used LLM framework",
        tag: "hot",
        resources: [
          { name: "LangChain Python Docs (free)", platform: "python.langchain.com", url: "https://python.langchain.com/docs/introduction/", icon: "LC" }
        ]
      },
      {
        id: "ga_06",
        name: "LLM evaluation — BLEU, ROUGE, BERTScore, LLM-as-judge, human evaluation",
        desc: "Knowing if your GenAI system works",
        tag: "hot",
        resources: [
          { name: "RAGAS — RAG evaluation framework (free)", platform: "docs.ragas.io", url: "https://docs.ragas.io/", icon: "RG" }
        ]
      },
      {
        id: "ga_07",
        name: "Vector databases — Pinecone, Chroma, Weaviate, FAISS — indexing, similarity search, ANN",
        desc: "Backbone of all RAG systems",
        tag: "hot",
        resources: [
          { name: "FAISS documentation (free)", platform: "faiss.ai", url: "https://faiss.ai/", icon: "FS" },
          { name: "Chroma quickstart (free)", platform: "docs.trychroma.com", url: "https://docs.trychroma.com/getting-started", icon: "CH" }
        ]
      },
      {
        id: "ga_08",
        name: "Diffusion models — DDPM, DDIM, Stable Diffusion, ControlNet, DiT",
        desc: "Image generation — growing fast",
        tag: "hot",
        resources: [
          { name: "Hugging Face Diffusion Models Course (free)", platform: "huggingface.co/learn", url: "https://huggingface.co/learn/diffusion-course/unit0/1", icon: "HF" },
          { name: "Annotated Diffusion Model (free blog)", platform: "huggingface.co blog", url: "https://huggingface.co/blog/annotated-diffusion", icon: "HF" }
        ]
      },
      {
        id: "ga_09",
        name: "GANs — generator, discriminator, training dynamics, mode collapse, StyleGAN, DCGAN",
        desc: "Classic generative model — still relevant",
        tag: "advanced",
        resources: [
          { name: "fast.ai GANs notebook (free)", platform: "course.fast.ai", url: "https://course.fast.ai/", icon: "FA" }
        ]
      },
      {
        id: "ga_10",
        name: "Multimodal models — CLIP, LLaVA, GPT-4V, vision-language models",
        desc: "Future of AI — text + image + audio",
        tag: "hot",
        resources: [
          { name: "CLIP paper explained — Yannic Kilcher", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=T9XSU0pKX2E", icon: "YT" }
        ]
      },
      {
        id: "ga_11",
        name: "AI agents — ReAct, tool-use, function calling, multi-agent systems",
        desc: "Hottest area in applied GenAI in 2025",
        tag: "hot",
        resources: [
          { name: "DeepLearning.AI AI Agents Course (free)", platform: "deeplearning.ai", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/", icon: "DL" }
        ]
      }
    ]
  },
  {
    id: "mlops",
    title: "MLOps & Deployment",
    phase: "Phase 3 · Days 34–38",
    color: "#fb923c",
    skills: [
      {
        id: "op_01",
        name: "FastAPI — build a model serving REST API with async, Pydantic validation",
        desc: "Standard Python API framework for ML",
        tag: "core",
        resources: [
          { name: "FastAPI Official Tutorial (free)", platform: "fastapi.tiangolo.com", url: "https://fastapi.tiangolo.com/tutorial/", icon: "FP" }
        ]
      },
      {
        id: "op_02",
        name: "Docker — Dockerfile, images, containers, docker-compose, GPU support",
        desc: "Non-negotiable for any deployed ML system",
        tag: "core",
        resources: [
          { name: "Docker Official Get Started (free)", platform: "docs.docker.com", url: "https://docs.docker.com/get-started/", icon: "DK" },
          { name: "TechWorld with Nana — Docker full course", platform: "YouTube (free)", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", icon: "YT" }
        ]
      },
      {
        id: "op_03",
        name: "Git & GitHub — branching, pull requests, merge conflicts, git rebase",
        desc: "Absolute baseline for any tech job",
        tag: "core",
        resources: [
          { name: "Pro Git book (free)", platform: "git-scm.com", url: "https://git-scm.com/book/en/v2", icon: "GT" }
        ]
      },
      {
        id: "op_04",
        name: "Experiment tracking — MLflow, Weights & Biases (W&B) — runs, metrics, model registry",
        desc: "Essential for serious ML work",
        tag: "hot",
        resources: [
          { name: "MLflow Quickstart (free)", platform: "mlflow.org", url: "https://mlflow.org/docs/latest/quickstart.html", icon: "ML" },
          { name: "W&B quickstart (free tier)", platform: "wandb.ai", url: "https://docs.wandb.ai/quickstart", icon: "WB" }
        ]
      },
      {
        id: "op_05",
        name: "Streamlit — build and deploy ML apps and demos",
        desc: "Fastest way to ship a visible project",
        tag: "hot",
        resources: [
          { name: "Streamlit official docs (free)", platform: "docs.streamlit.io", url: "https://docs.streamlit.io/", icon: "ST" }
        ]
      },
      {
        id: "op_06",
        name: "CI/CD — GitHub Actions, automated testing, model validation pipelines",
        desc: "Production ML workflow",
        tag: "advanced",
        resources: [
          { name: "GitHub Actions Quickstart (free)", platform: "docs.github.com", url: "https://docs.github.com/en/actions/quickstart", icon: "GH" }
        ]
      },
      {
        id: "op_07",
        name: "Cloud ML — AWS SageMaker or GCP Vertex AI — training jobs, endpoints, notebooks",
        desc: "All production ML runs on cloud",
        tag: "advanced",
        resources: [
          { name: "AWS SageMaker Studio Lab (free tier)", platform: "studiolab.sagemaker.aws", url: "https://studiolab.sagemaker.aws/", icon: "AW" },
          { name: "Google Cloud ML free tier", platform: "cloud.google.com", url: "https://cloud.google.com/free", icon: "GC" }
        ]
      },
      {
        id: "op_08",
        name: "Model monitoring — data drift, concept drift, Evidently AI, Prometheus",
        desc: "Models degrade silently without monitoring",
        tag: "advanced",
        resources: [
          { name: "Evidently AI (free, open source)", platform: "evidentlyai.com", url: "https://docs.evidentlyai.com/", icon: "EV" }
        ]
      },
      {
        id: "op_09",
        name: "Feature stores — Feast, Tecton — online vs offline features",
        desc: "Enterprise-scale ML infrastructure",
        tag: "advanced",
        resources: [
          { name: "Feast documentation (free)", platform: "docs.feast.dev", url: "https://docs.feast.dev/", icon: "FS" }
        ]
      },
      {
        id: "op_10",
        name: "Model explainability — SHAP, LIME, permutation importance, partial dependence plots",
        desc: "Required for regulated industries",
        tag: "hot",
        resources: [
          { name: "SHAP documentation (free)", platform: "shap.readthedocs.io", url: "https://shap.readthedocs.io/en/latest/", icon: "SH" }
        ]
      }
    ]
  },
  {
    id: "soft",
    title: "Storytelling, Communication & Soft Skills",
    phase: "Phase 4 · Days 39–45",
    color: "#9ca3af",
    skills: [
      {
        id: "so_01",
        name: "Translating model results to business impact and decisions",
        desc: "Most underrated skill — what separates DS from analyst",
        tag: "core",
        resources: [
          { name: "Storytelling with Data (free blog content)", platform: "storytellingwithdata.com", url: "https://www.storytellingwithdata.com/blog", icon: "BL" }
        ]
      },
      {
        id: "so_02",
        name: "Dashboard building — Tableau Public, Power BI, Metabase, or Grafana",
        desc: "Communicating insights visually",
        tag: "core",
        resources: [
          { name: "Tableau Public (free)", platform: "public.tableau.com", url: "https://public.tableau.com/", icon: "TB" },
          { name: "Power BI Desktop (free)", platform: "microsoft.com", url: "https://powerbi.microsoft.com/desktop/", icon: "PB" }
        ]
      },
      {
        id: "so_03",
        name: "Writing clean, reproducible notebooks with clear narrative",
        desc: "Hiring managers read your notebooks",
        tag: "core",
        resources: [
          { name: "Nbformat & best practices guide", platform: "docs.jupyter.org (free)", url: "https://docs.jupyter.org/en/latest/", icon: "JP" }
        ]
      },
      {
        id: "so_04",
        name: "ML system design — designing end-to-end ML systems for product interviews",
        desc: "Mid-senior ML engineer interviews",
        tag: "hot",
        resources: [
          { name: "Chip Huyen ML Interviews book (free)", platform: "huyenchip.com", url: "https://huyenchip.com/ml-interviews-book/", icon: "BK" },
          { name: "Made With ML — MLOps Design", platform: "madewithml.com (free)", url: "https://madewithml.com/", icon: "MW" }
        ]
      },
      {
        id: "so_05",
        name: "Presenting findings to non-technical stakeholders",
        desc: "Empathy + clarity — practice this weekly",
        tag: "core",
        resources: [
          { name: "Google Slides or Canva (free)", platform: "canva.com", url: "https://www.canva.com/", icon: "CV" }
        ]
      },
      {
        id: "so_06",
        name: "Interview prep — DS statistics Q&A, ML concept questions, SQL coding",
        desc: "Dedicated grind time every day in Phase 4",
        tag: "core",
        resources: [
          { name: "Chip Huyen ML Interview Questions (free)", platform: "huyenchip.com", url: "https://huyenchip.com/ml-interviews-book/", icon: "BK" },
          { name: "Nick Singh — DS Interview Q&A (free)", platform: "nicksingh.com", url: "https://www.nicksingh.com/posts/40-probability-statistics-data-science-interview-questions-asked-by-fang-wall-street", icon: "BL" },
          { name: "Pramp — free mock interviews", platform: "pramp.com", url: "https://www.pramp.com/", icon: "PM" }
        ]
      }
    ]
  }
];
