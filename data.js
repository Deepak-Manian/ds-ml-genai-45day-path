const SECTIONS = [
  {
    id: "python_basics",
    title: "Python Fundamentals — Full Revision",
    phase: "Phase 0 · Days 1–4 · Earth",
    element: "earth",
    skills: [
      { id:"pyb_01", name:"Variables, data types, type casting, operators", desc:"Integers, floats, strings, booleans — the atoms of Python", tag:"core", resources:[{name:"Python Official Tutorial",platform:"docs.python.org (free)",url:"https://docs.python.org/3/tutorial/introduction.html",icon:"PY"},{name:"freeCodeCamp Python for Beginners",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=rfscVS0vtbw",icon:"YT"}]},
      { id:"pyb_02", name:"Control flow — if/elif/else, for/while loops, break/continue/pass", desc:"Logic branching is the skeleton of every program", tag:"core", resources:[{name:"Real Python Control Flow",platform:"realpython.com (free)",url:"https://realpython.com/python-conditional-statements/",icon:"RP"}]},
      { id:"pyb_03", name:"Data structures — lists, tuples, sets, dicts — full mastery", desc:"Choose the right structure and your code gets 10x cleaner", tag:"core", resources:[{name:"Corey Schafer — Python Data Structures",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=W8KRzm-HUcc",icon:"YT"},{name:"Python Official Data Structures",platform:"docs.python.org (free)",url:"https://docs.python.org/3/tutorial/datastructures.html",icon:"PY"}]},
      { id:"pyb_04", name:"Functions — args, kwargs, *args, **kwargs, default values, LEGB scope", desc:"Functions are the units of reuse — master every argument mode", tag:"core", resources:[{name:"Real Python Functions Guide",platform:"realpython.com (free)",url:"https://realpython.com/defining-your-own-python-function/",icon:"RP"}]},
      { id:"pyb_05", name:"String manipulation — slicing, f-strings, format, regex basics", desc:"Text is everywhere in NLP, file parsing, and logging", tag:"core", resources:[{name:"Python String Methods Crash Course",platform:"YouTube · Corey Schafer",url:"https://www.youtube.com/watch?v=k9TUPpGqYTo",icon:"YT"},{name:"Regex HowTo — Python docs",platform:"docs.python.org (free)",url:"https://docs.python.org/3/howto/regex.html",icon:"PY"}]},
      { id:"pyb_06", name:"File I/O — reading/writing CSV, JSON, text files, pathlib", desc:"Real data comes from files — know every pattern cold", tag:"core", resources:[{name:"Real Python File I/O",platform:"realpython.com (free)",url:"https://realpython.com/read-write-files-python/",icon:"RP"}]},
      { id:"pyb_07", name:"Error handling — try/except/finally, custom exceptions, logging", desc:"Production code never crashes silently", tag:"core", resources:[{name:"Real Python Exceptions",platform:"realpython.com (free)",url:"https://realpython.com/python-exceptions/",icon:"RP"}]},
      { id:"pyb_08", name:"Modules & packages — import system, __init__.py, pip, conda, poetry", desc:"How Python code gets organized at scale", tag:"core", resources:[{name:"Real Python Modules Guide",platform:"realpython.com (free)",url:"https://realpython.com/python-modules-packages/",icon:"RP"}]},
      { id:"pyb_09", name:"List/dict comprehensions, generators, iterators — Pythonic idioms", desc:"These appear in every serious Python codebase", tag:"core", resources:[{name:"Real Python Comprehensions",platform:"realpython.com (free)",url:"https://realpython.com/list-comprehension-python/",icon:"RP"},{name:"Real Python Generators",platform:"realpython.com (free)",url:"https://realpython.com/introduction-to-python-generators/",icon:"RP"}]},
      { id:"pyb_10", name:"OOP — classes, __init__, inheritance, dunder methods, @property, @classmethod", desc:"Build reusable ML pipelines and custom sklearn estimators", tag:"core", resources:[{name:"Corey Schafer OOP Series",platform:"YouTube (free)",url:"https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeZtO",icon:"YT"}]},
      { id:"pyb_11", name:"Decorators, context managers, functools (partial, reduce, lru_cache)", desc:"Advanced Python patterns used in every major framework", tag:"advanced", resources:[{name:"Real Python Decorators",platform:"realpython.com (free)",url:"https://realpython.com/primer-on-python-decorators/",icon:"RP"}]},
      { id:"pyb_12", name:"Type hints, mypy — write self-documenting production code", desc:"Type hints are now standard in all serious Python projects", tag:"hot", resources:[{name:"Real Python Type Checking",platform:"realpython.com (free)",url:"https://realpython.com/python-type-checking/",icon:"RP"}]}
    ]
  },
  {
    id: "python",
    title: "Python for Data Science",
    phase: "Phase 1 · Days 5–8 · Earth",
    element: "earth",
    skills: [
      { id:"py_01", name:"NumPy — arrays, broadcasting, vectorised operations", desc:"Foundation for all numerical computing in Python", tag:"core", resources:[{name:"NumPy Official Quickstart",platform:"numpy.org",url:"https://numpy.org/doc/stable/user/quickstart.html",icon:"NP"},{name:"NumPy in 60 Minutes",platform:"YouTube · freeCodeCamp",url:"https://www.youtube.com/watch?v=QUT1VHiLmmI",icon:"YT"},{name:"Kaggle Python + NumPy",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/python",icon:"KG"}]},
      { id:"py_02", name:"Pandas — DataFrames, groupby, merge, apply, pivot tables", desc:"Most-used library in every DS job worldwide", tag:"core", resources:[{name:"Pandas Official Getting Started",platform:"pandas.pydata.org",url:"https://pandas.pydata.org/docs/getting_started/intro_tutorials/",icon:"PD"},{name:"Kaggle Pandas Course",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/pandas",icon:"KG"},{name:"Pandas in 1 Hour — Tech With Tim",platform:"YouTube",url:"https://www.youtube.com/watch?v=vmEHCJofslg",icon:"YT"}]},
      { id:"py_03", name:"Matplotlib & Seaborn — plots, heatmaps, distributions", desc:"Core visualisation stack for every DS role", tag:"core", resources:[{name:"Matplotlib Official Tutorials",platform:"matplotlib.org",url:"https://matplotlib.org/stable/tutorials/index.html",icon:"MP"},{name:"Seaborn Official Tutorial",platform:"seaborn.pydata.org",url:"https://seaborn.pydata.org/tutorial.html",icon:"SB"},{name:"Kaggle Data Visualisation",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/data-visualization",icon:"KG"}]},
      { id:"py_04", name:"Plotly — interactive visualisations & dashboards", desc:"For building shareable, interactive charts", tag:"advanced", resources:[{name:"Plotly Python Open Source",platform:"plotly.com (free)",url:"https://plotly.com/python/",icon:"PL"},{name:"Plotly Dash Tutorial",platform:"YouTube · Charming Data",url:"https://www.youtube.com/watch?v=hSPmj7mK6ng",icon:"YT"}]},
      { id:"py_05", name:"Jupyter Notebooks — reproducible notebook discipline, nbstripout", desc:"How you present your work matters as much as the work", tag:"core", resources:[{name:"Jupyter Official Documentation",platform:"jupyter.org (free)",url:"https://jupyter-notebook.readthedocs.io/en/stable/",icon:"JP"},{name:"Kaggle Notebooks (free cloud)",platform:"Kaggle",url:"https://www.kaggle.com/code",icon:"KG"}]}
    ]
  },
  {
    id: "sql",
    title: "SQL & Databases",
    phase: "Phase 1 · Days 7–10 · Earth",
    element: "earth",
    skills: [
      { id:"sql_01", name:"SELECT, WHERE, GROUP BY, HAVING, ORDER BY", desc:"Absolute basics — must be completely fluent", tag:"core", resources:[{name:"Mode SQL Tutorial",platform:"mode.com (free)",url:"https://mode.com/sql-tutorial/",icon:"MD"},{name:"SQLZoo Interactive",platform:"sqlzoo.net (free)",url:"https://sqlzoo.net/",icon:"SZ"},{name:"Kaggle Intro to SQL",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/intro-to-sql",icon:"KG"}]},
      { id:"sql_02", name:"JOINs — INNER, LEFT, RIGHT, FULL OUTER, SELF, CROSS", desc:"Top interview topic — every DS interview has JOIN questions", tag:"core", resources:[{name:"Visual JOIN explanation",platform:"sql-joins.leopard.in.ua",url:"https://sql-joins.leopard.in.ua/",icon:"VJ"},{name:"Advanced SQL — Kaggle",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/advanced-sql",icon:"KG"}]},
      { id:"sql_03", name:"Window functions — ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE", desc:"Separates junior from mid-level engineers in interviews", tag:"core", resources:[{name:"Mode SQL Window Functions",platform:"mode.com (free)",url:"https://mode.com/sql-tutorial/sql-window-functions/",icon:"MD"}]},
      { id:"sql_04", name:"CTEs and subqueries — WITH clause, correlated subqueries", desc:"Write clean, readable, complex queries", tag:"core", resources:[{name:"CTEs in SQL — Mode",platform:"mode.com (free)",url:"https://mode.com/sql-tutorial/sql-with-statement/",icon:"MD"}]},
      { id:"sql_05", name:"Aggregations, date functions, string functions — practice daily", desc:"Day-to-day data wrangling in SQL", tag:"core", resources:[{name:"LeetCode SQL (free tier)",platform:"LeetCode",url:"https://leetcode.com/problemset/database/",icon:"LC"},{name:"HackerRank SQL (free)",platform:"HackerRank",url:"https://www.hackerrank.com/domains/sql",icon:"HR"}]},
      { id:"sql_06", name:"Query optimisation — indexes, EXPLAIN ANALYZE, query plans, partitioning", desc:"Senior-level SQL knowledge that sets you apart", tag:"advanced", resources:[{name:"Use The Index, Luke (free book)",platform:"use-the-index-luke.com",url:"https://use-the-index-luke.com/",icon:"UI"}]},
      { id:"sql_07", name:"NoSQL basics — MongoDB, document model, when to choose NoSQL", desc:"Awareness level needed for modern ML pipelines", tag:"advanced", resources:[{name:"MongoDB University (free courses)",platform:"learn.mongodb.com",url:"https://learn.mongodb.com/",icon:"MG"}]}
    ]
  },
  {
    id: "stats",
    title: "Statistics & Probability",
    phase: "Phase 1 · Days 9–14 · Water",
    element: "water",
    skills: [
      { id:"st_01", name:"Descriptive stats — mean, median, variance, std, IQR, skewness, kurtosis", desc:"Foundational — comes up in every interview and analysis", tag:"core", resources:[{name:"Khan Academy Statistics (free)",platform:"khanacademy.org",url:"https://www.khanacademy.org/math/statistics-probability",icon:"KA"},{name:"StatQuest — Statistics Fundamentals",platform:"YouTube (free)",url:"https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9",icon:"YT"}]},
      { id:"st_02", name:"Probability distributions — Normal, Binomial, Poisson, Uniform, Exponential", desc:"Core for ML theory and every DS interview", tag:"core", resources:[{name:"StatQuest Distributions playlist",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=iYiOVISWXS4",icon:"YT"},{name:"Khan Academy Probability",platform:"khanacademy.org (free)",url:"https://www.khanacademy.org/math/statistics-probability/probability-library",icon:"KA"}]},
      { id:"st_03", name:"Central Limit Theorem — sampling distributions, standard error", desc:"Critical for understanding ML evaluation and confidence intervals", tag:"core", resources:[{name:"StatQuest CLT (10 min)",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=YAlJCEDH2uY",icon:"YT"}]},
      { id:"st_04", name:"Hypothesis testing — t-test, chi-square, ANOVA, Mann-Whitney", desc:"A/B testing backbone — every product DS role requires this", tag:"core", resources:[{name:"StatQuest Hypothesis Testing",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=0oc49DyA3hU",icon:"YT"},{name:"Khan Academy Significance Tests",platform:"khanacademy.org (free)",url:"https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample",icon:"KA"}]},
      { id:"st_05", name:"p-values, confidence intervals, Type I/II errors, statistical power", desc:"Misunderstood by most candidates — master this completely", tag:"core", resources:[{name:"StatQuest p-values",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=vemZtEM63GY",icon:"YT"}]},
      { id:"st_06", name:"Bayesian statistics — Bayes' theorem, priors, posteriors, likelihood", desc:"Increasingly important in modern ML and probabilistic programming", tag:"core", resources:[{name:"3Blue1Brown — Bayes Theorem",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=HZGCoVF3YvM",icon:"YT"},{name:"Probabilistic Programming (free book)",platform:"github.com",url:"https://github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers",icon:"GH"}]},
      { id:"st_07", name:"A/B testing — experiment design, sample size calculation, MDE, multivariate", desc:"Top DS interview topic at every product company", tag:"hot", resources:[{name:"Evan Miller Sample Size Calculator",platform:"evanmiller.org (free)",url:"https://www.evanmiller.org/ab-testing/",icon:"EM"},{name:"Udacity A/B Testing Free Course",platform:"Udacity (free)",url:"https://www.udacity.com/course/ab-testing--ud257",icon:"UD"}]},
      { id:"st_08", name:"Correlation vs causation — Simpson's paradox, confounders, causal graphs", desc:"Critical thinking that separates good data scientists", tag:"core", resources:[{name:"Calling Bullshit — free lecture series",platform:"callingbullshit.org (free)",url:"https://www.callingbullshit.org/videos.html",icon:"CB"}]}
    ]
  },
  {
    id: "math",
    title: "Math for ML — Linear Algebra & Calculus",
    phase: "Phase 1 · Days 12–16 · Earth",
    element: "earth",
    skills: [
      { id:"ma_01", name:"Vectors, dot products, norms, cosine similarity", desc:"Embeddings, NLP, and recommenders all rely on this", tag:"core", resources:[{name:"3Blue1Brown — Essence of Linear Algebra",platform:"YouTube (free)",url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",icon:"YT"},{name:"Khan Academy Linear Algebra",platform:"khanacademy.org (free)",url:"https://www.khanacademy.org/math/linear-algebra",icon:"KA"}]},
      { id:"ma_02", name:"Matrices — multiplication, transpose, inverse, rank, determinant", desc:"Core to all ML mathematics", tag:"core", resources:[{name:"3Blue1Brown Linear Algebra series",platform:"YouTube (free)",url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",icon:"YT"}]},
      { id:"ma_03", name:"Eigenvalues & eigenvectors — PCA and SVD intuition", desc:"Needed to truly understand dimensionality reduction", tag:"core", resources:[{name:"3Blue1Brown Eigenvalues",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=PFDu9oVAE-g",icon:"YT"},{name:"StatQuest PCA step-by-step",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=FgakZw6K1QQ",icon:"YT"}]},
      { id:"ma_04", name:"Derivatives, partial derivatives, chain rule", desc:"Backpropagation is just the chain rule applied recursively", tag:"core", resources:[{name:"3Blue1Brown — Essence of Calculus",platform:"YouTube (free)",url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",icon:"YT"}]},
      { id:"ma_05", name:"Gradient vectors, Jacobian, Hessian", desc:"Understand optimisation deeply — not just gradient descent", tag:"advanced", resources:[{name:"Mathematics for ML (free textbook)",platform:"mml-book.github.io",url:"https://mml-book.github.io/",icon:"BK"}]},
      { id:"ma_06", name:"Convexity, loss landscapes, saddle points", desc:"Why some problems optimise easily and others don't", tag:"advanced", resources:[{name:"CS229 Notes — Andrew Ng (free)",platform:"cs229.stanford.edu",url:"https://cs229.stanford.edu/main_notes.pdf",icon:"ST"}]}
    ]
  },
  {
    id: "eda",
    title: "Data Wrangling & EDA",
    phase: "Phase 2 · Days 17–20 · Water",
    element: "water",
    skills: [
      { id:"ed_01", name:"Missing value analysis — patterns, MCAR/MAR/MNAR, imputation strategies", desc:"Real data is always dirty — know every imputation method", tag:"core", resources:[{name:"Kaggle Data Cleaning Course (free)",platform:"Kaggle Learn",url:"https://www.kaggle.com/learn/data-cleaning",icon:"KG"}]},
      { id:"ed_02", name:"Outlier detection — IQR, Z-score, isolation forest, visual methods", desc:"Outliers can make or break your model performance", tag:"core", resources:[{name:"Kaggle Data Cleaning",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/data-cleaning",icon:"KG"}]},
      { id:"ed_03", name:"Feature distributions — skewness, log transforms, Box-Cox, Yeo-Johnson", desc:"Many models assume normality or symmetric distributions", tag:"core", resources:[{name:"Feature Engineering for ML — Kaggle",platform:"Kaggle Learn (free)",url:"https://www.kaggle.com/learn/feature-engineering",icon:"KG"}]},
      { id:"ed_04", name:"Correlation analysis — Pearson, Spearman, Cramér's V, VIF for multicollinearity", desc:"Feature selection and understanding data relationships", tag:"core", resources:[{name:"StatQuest Correlation",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=xZ_z8KWkhXE",icon:"YT"}]},
      { id:"ed_05", name:"Feature engineering — binning, target encoding, interaction features, datetime features", desc:"Often more impactful than the model you choose", tag:"core", resources:[{name:"Feature Engineering — Kaggle Learn (free)",platform:"Kaggle Learn",url:"https://www.kaggle.com/learn/feature-engineering",icon:"KG"}]},
      { id:"ed_06", name:"Feature scaling — StandardScaler, MinMaxScaler, RobustScaler", desc:"Required for distance-based and gradient-based methods", tag:"core", resources:[{name:"Scikit-learn Preprocessing Guide",platform:"scikit-learn.org (free)",url:"https://scikit-learn.org/stable/modules/preprocessing.html",icon:"SK"}]},
      { id:"ed_07", name:"Encoding — OneHot, Label, Target, Binary, Ordinal encoding strategies", desc:"Handling categorical variables correctly is non-trivial", tag:"core", resources:[{name:"Category Encoders library docs (free)",platform:"contrib.scikit-learn.org",url:"https://contrib.scikit-learn.org/category_encoders/",icon:"SK"}]}
    ]
  },
  {
    id: "ml_core",
    title: "Core Machine Learning Algorithms",
    phase: "Phase 2 · Days 19–28 · Fire",
    element: "fire",
    skills: [
      { id:"ml_01", name:"Linear regression — OLS, assumptions, R², adjusted R², multicollinearity", desc:"Most-asked regression topic in every DS interview", tag:"core", resources:[{name:"StatQuest Linear Regression",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=nk2CQITm_eo",icon:"YT"},{name:"Andrew Ng ML Course (free audit)",platform:"Coursera / DeepLearning.AI",url:"https://www.coursera.org/learn/machine-learning",icon:"CO"}]},
      { id:"ml_02", name:"Logistic regression — sigmoid, log-loss, odds ratio, decision boundary", desc:"Most-asked classification baseline in every interview", tag:"core", resources:[{name:"StatQuest Logistic Regression",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=yIYKR4sgzI8",icon:"YT"}]},
      { id:"ml_03", name:"Decision trees — Gini impurity, entropy, information gain, pruning", desc:"Foundation for understanding all ensemble methods", tag:"core", resources:[{name:"StatQuest Decision Trees",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=7VeUPuFGJHk",icon:"YT"}]},
      { id:"ml_04", name:"Random Forest — bagging, feature importance, OOB error", desc:"Industry workhorse — understand it deeply", tag:"core", resources:[{name:"StatQuest Random Forest",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=J4Wdy0Wc_xQ",icon:"YT"}]},
      { id:"ml_05", name:"Gradient Boosting — XGBoost, LightGBM, CatBoost — theory + practice", desc:"Wins most tabular ML competitions — know it inside out", tag:"core", resources:[{name:"StatQuest Gradient Boosting",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=3CC4N4z3GJc",icon:"YT"},{name:"XGBoost Documentation (free)",platform:"xgboost.readthedocs.io",url:"https://xgboost.readthedocs.io/en/latest/tutorials/model.html",icon:"XG"}]},
      { id:"ml_06", name:"SVM — margin, kernel trick (RBF, polynomial), support vectors", desc:"Theory is heavily tested in senior DS/ML interviews", tag:"core", resources:[{name:"StatQuest SVM",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=efR1C6CvhmE",icon:"YT"}]},
      { id:"ml_07", name:"KNN — distance metrics, curse of dimensionality, approximate NN", desc:"Simple but conceptually important for embeddings too", tag:"core", resources:[{name:"StatQuest KNN",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=HVXime0nQeI",icon:"YT"}]},
      { id:"ml_08", name:"Naive Bayes — Gaussian, Multinomial, Bernoulli, text classification", desc:"Fast, strong baseline — know all three variants", tag:"core", resources:[{name:"StatQuest Naive Bayes",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=O2L2Uv9pdDA",icon:"YT"}]},
      { id:"ml_09", name:"K-Means clustering — inertia, elbow method, k-means++", desc:"Most common unsupervised algorithm in production", tag:"core", resources:[{name:"StatQuest K-Means",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=4b5d3muPQmA",icon:"YT"}]},
      { id:"ml_10", name:"DBSCAN — density-based clustering, epsilon, min_samples, noise points", desc:"Better than K-Means for non-spherical clusters and anomaly detection", tag:"core", resources:[{name:"Scikit-learn DBSCAN Guide",platform:"scikit-learn.org (free)",url:"https://scikit-learn.org/stable/modules/clustering.html#dbscan",icon:"SK"}]},
      { id:"ml_11", name:"PCA — dimensionality reduction, explained variance, scree plot", desc:"Fundamental for high-dimensional data and preprocessing", tag:"core", resources:[{name:"StatQuest PCA",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=FgakZw6K1QQ",icon:"YT"}]},
      { id:"ml_12", name:"t-SNE & UMAP — non-linear dim reduction, visualising embeddings", desc:"Used everywhere for embedding and cluster visualisation", tag:"hot", resources:[{name:"UMAP documentation (free)",platform:"umap-learn.readthedocs.io",url:"https://umap-learn.readthedocs.io/",icon:"UM"}]},
      { id:"ml_13", name:"Model evaluation — cross-validation, train/val/test split, data leakage prevention", desc:"Avoiding the #1 mistake that ruins every ML project", tag:"core", resources:[{name:"Scikit-learn Model Evaluation (free)",platform:"scikit-learn.org",url:"https://scikit-learn.org/stable/modules/model_evaluation.html",icon:"SK"}]},
      { id:"ml_14", name:"Classification metrics — precision, recall, F1, ROC-AUC, PR curves, MCC", desc:"Know when to use each metric — context determines choice", tag:"core", resources:[{name:"StatQuest ROC and AUC",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=4jRBRDbJemM",icon:"YT"}]},
      { id:"ml_15", name:"Regression metrics — MAE, MSE, RMSE, MAPE, R²", desc:"Each metric tells a different story about model errors", tag:"core", resources:[{name:"Scikit-learn Regression Metrics",platform:"scikit-learn.org (free)",url:"https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics",icon:"SK"}]},
      { id:"ml_16", name:"Imbalanced classes — SMOTE, class weights, undersampling, threshold tuning", desc:"Real-world fraud, medical, and churn data is always imbalanced", tag:"hot", resources:[{name:"imbalanced-learn docs (free)",platform:"imbalanced-learn.org",url:"https://imbalanced-learn.org/stable/",icon:"IL"}]},
      { id:"ml_17", name:"Hyperparameter tuning — GridSearchCV, RandomSearch, Optuna, Bayesian optimisation", desc:"Squeeze every last % of performance from your model", tag:"core", resources:[{name:"Optuna documentation (free)",platform:"optuna.readthedocs.io",url:"https://optuna.readthedocs.io/en/stable/",icon:"OP"}]},
      { id:"ml_18", name:"Anomaly detection — Isolation Forest, LOF, One-Class SVM, Autoencoder-based", desc:"Fraud detection, cybersecurity, industrial QA all need this", tag:"hot", resources:[{name:"Scikit-learn Novelty Detection (free)",platform:"scikit-learn.org",url:"https://scikit-learn.org/stable/modules/outlier_detection.html",icon:"SK"}]},
      { id:"ml_19", name:"Time-series ML — lag features, rolling stats, ARIMA, Prophet, LightGBM for TS", desc:"Finance, supply chain, demand forecasting — every industry needs this", tag:"hot", resources:[{name:"Kaggle Time Series Course (free)",platform:"Kaggle Learn",url:"https://www.kaggle.com/learn/time-series",icon:"KG"},{name:"Prophet documentation (free)",platform:"facebook.github.io/prophet",url:"https://facebook.github.io/prophet/docs/quick_start.html",icon:"FB"}]},
      { id:"ml_20", name:"Recommender systems — collaborative filtering, matrix factorisation, content-based", desc:"Netflix, Spotify, Amazon — recommenders are in every product", tag:"hot", resources:[{name:"Surprise library docs (free)",platform:"surpriselib.com",url:"http://surpriselib.com/",icon:"SR"}]}
    ]
  },
  {
    id: "dl",
    title: "Deep Learning",
    phase: "Phase 3 · Days 29–36 · Fire",
    element: "fire",
    skills: [
      { id:"dl_01", name:"Neural network fundamentals — perceptron, layers, activation functions", desc:"Every DL model is just stacked layers with activations", tag:"core", resources:[{name:"3Blue1Brown Neural Networks series",platform:"YouTube (free)",url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",icon:"YT"},{name:"Fast.ai Practical Deep Learning (free)",platform:"fast.ai",url:"https://course.fast.ai/",icon:"FA"}]},
      { id:"dl_02", name:"Backpropagation — chain rule, gradient flow, computational graphs", desc:"The engine of all neural network training — build it from scratch once", tag:"core", resources:[{name:"Andrej Karpathy micrograd (free)",platform:"YouTube / GitHub",url:"https://www.youtube.com/watch?v=VMj-3S1tku0",icon:"YT"}]},
      { id:"dl_03", name:"Optimisers — SGD, Momentum, AdaGrad, RMSProp, Adam, AdamW, LARS", desc:"Different optimisers for different problem scales", tag:"core", resources:[{name:"Sebastian Ruder — Optimisation overview (free)",platform:"ruder.io",url:"https://www.ruder.io/optimizing-gradient-descent/",icon:"BL"}]},
      { id:"dl_04", name:"Regularisation — dropout, batch norm, layer norm, weight decay, early stopping", desc:"The techniques that make deep networks actually work", tag:"core", resources:[{name:"DeepLearning.AI Deep Learning Spec (free audit)",platform:"Coursera",url:"https://www.coursera.org/specializations/deep-learning",icon:"CO"}]},
      { id:"dl_05", name:"PyTorch — tensors, autograd, nn.Module, DataLoader, training loop", desc:"Industry standard for research and production DL in 2025", tag:"core", resources:[{name:"PyTorch Official Tutorials (free)",platform:"pytorch.org",url:"https://pytorch.org/tutorials/",icon:"PT"},{name:"Andrej Karpathy — Neural Nets from scratch",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=VMj-3S1tku0",icon:"YT"}]},
      { id:"dl_06", name:"CNNs — convolution, pooling, stride, padding, LeNet, VGG, ResNet, EfficientNet", desc:"Foundation of all computer vision — understand every layer", tag:"core", resources:[{name:"CS231n Stanford (free)",platform:"cs231n.stanford.edu",url:"http://cs231n.stanford.edu/",icon:"ST"}]},
      { id:"dl_07", name:"RNNs & LSTMs — sequence modelling, vanishing gradients, gating mechanisms", desc:"Before transformers — still widely used in production systems", tag:"core", resources:[{name:"Colah's LSTM blog (free)",platform:"colah.github.io",url:"https://colah.github.io/posts/2015-08-Understanding-LSTMs/",icon:"BL"}]},
      { id:"dl_08", name:"Transformers — attention, multi-head attention, positional encoding, encoder/decoder", desc:"The architecture behind virtually everything in 2024–2025", tag:"hot", resources:[{name:"Illustrated Transformer — Jay Alammar (free)",platform:"jalammar.github.io",url:"https://jalammar.github.io/illustrated-transformer/",icon:"BL"},{name:"Attention is All You Need (free paper)",platform:"arxiv.org",url:"https://arxiv.org/abs/1706.03762",icon:"AR"}]},
      { id:"dl_09", name:"Transfer learning — pretrained models, fine-tuning strategies, feature extraction", desc:"You almost never train from scratch in industry — know this deeply", tag:"core", resources:[{name:"Fast.ai Transfer Learning (free)",platform:"fast.ai",url:"https://course.fast.ai/",icon:"FA"}]},
      { id:"dl_10", name:"Learning rate scheduling — warmup, cosine decay, one-cycle, cyclic LR", desc:"Critical for training convergence in large models", tag:"advanced", resources:[{name:"PyTorch LR Scheduler docs (free)",platform:"pytorch.org",url:"https://pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate",icon:"PT"}]}
    ]
  },
  {
    id: "nlp",
    title: "NLP — Natural Language Processing",
    phase: "Phase 3 · Days 33–38 · Wind",
    element: "wind",
    skills: [
      { id:"nlp_01", name:"Text preprocessing — tokenisation, stemming, lemmatisation, stopwords", desc:"Every NLP pipeline starts here — know spaCy and NLTK", tag:"core", resources:[{name:"NLTK Book (free)",platform:"nltk.org",url:"https://www.nltk.org/book/",icon:"NL"}]},
      { id:"nlp_02", name:"TF-IDF, Bag of Words, n-grams — classical NLP features", desc:"Still used in production — baseline before deep NLP", tag:"core", resources:[{name:"Scikit-learn Text Feature Extraction (free)",platform:"scikit-learn.org",url:"https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction",icon:"SK"}]},
      { id:"nlp_03", name:"Word embeddings — Word2Vec, GloVe, FastText — semantic vector spaces", desc:"Understanding meaning through geometry", tag:"core", resources:[{name:"Jay Alammar Word2Vec visual (free)",platform:"jalammar.github.io",url:"https://jalammar.github.io/illustrated-word2vec/",icon:"BL"}]},
      { id:"nlp_04", name:"BERT & variants — tokenisation, CLS token, fine-tuning for classification/NER", desc:"Industry-standard NLP backbone for 2024–2025", tag:"hot", resources:[{name:"HuggingFace Course (free)",platform:"huggingface.co",url:"https://huggingface.co/learn/nlp-course/chapter1/1",icon:"HF"}]},
      { id:"nlp_05", name:"Named entity recognition, POS tagging, dependency parsing", desc:"Information extraction from unstructured text", tag:"core", resources:[{name:"spaCy course (free)",platform:"spacy.io",url:"https://course.spacy.io/en",icon:"SP"}]},
      { id:"nlp_06", name:"Sentence transformers — semantic similarity, dense retrieval, biencoder/crossencoder", desc:"Powers search, deduplication, and clustering on text", tag:"hot", resources:[{name:"Sentence Transformers docs (free)",platform:"sbert.net",url:"https://www.sbert.net/",icon:"SB"}]},
      { id:"nlp_07", name:"Vector databases — FAISS, Chroma, Pinecone — semantic search and RAG backends", desc:"Essential for every RAG and search system", tag:"hot", resources:[{name:"FAISS documentation (free)",platform:"faiss.ai",url:"https://faiss.ai/",icon:"FS"}]}
    ]
  },
  {
    id: "cv",
    title: "Computer Vision",
    phase: "Phase 3 · Days 36–40 · Wind",
    element: "wind",
    skills: [
      { id:"cv_01", name:"Image preprocessing — resize, normalise, augmentation (albumentations, torchvision)", desc:"Data augmentation often beats architecture changes for performance", tag:"core", resources:[{name:"Albumentations docs (free)",platform:"albumentations.ai",url:"https://albumentations.ai/docs/",icon:"AL"}]},
      { id:"cv_02", name:"Object detection — YOLO, Faster R-CNN, anchor boxes, NMS, mAP metric", desc:"Real-time detection is the most deployed CV system", tag:"hot", resources:[{name:"YOLOv8 documentation (free)",platform:"ultralytics.com",url:"https://docs.ultralytics.com/",icon:"YL"}]},
      { id:"cv_03", name:"Image segmentation — semantic vs instance, U-Net, Mask R-CNN, SAM", desc:"Medical imaging, autonomous vehicles, satellite imagery", tag:"advanced", resources:[{name:"Papers With Code Segmentation (free)",platform:"paperswithcode.com",url:"https://paperswithcode.com/task/semantic-segmentation",icon:"PW"}]},
      { id:"cv_04", name:"Vision Transformers (ViT) — patch embeddings, self-attention on images, CLIP", desc:"CNN alternative that now dominates many benchmarks", tag:"hot", resources:[{name:"ViT paper explained — YouTube (free)",platform:"YouTube",url:"https://www.youtube.com/watch?v=TrdevFK_am4",icon:"YT"}]},
      { id:"cv_05", name:"OpenCV — image ops, edge detection, contours, traditional CV pipelines", desc:"Industrial CV preprocessing and classical computer vision", tag:"core", resources:[{name:"OpenCV Python Tutorial (free)",platform:"docs.opencv.org",url:"https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",icon:"CV"}]}
    ]
  },
  {
    id: "genai",
    title: "Generative AI & LLMs",
    phase: "Phase 3 · Days 39–44 · Lightning",
    element: "lightning",
    skills: [
      { id:"ga_01", name:"LLM architecture — GPT, decoder-only, causal attention, KV cache, tokenisation", desc:"Know exactly what you're building on top of", tag:"hot", resources:[{name:"Andrej Karpathy — Let's build GPT (free)",platform:"YouTube",url:"https://www.youtube.com/watch?v=kCc8FmEb1nY",icon:"YT"}]},
      { id:"ga_02", name:"Prompt engineering — zero-shot, few-shot, chain-of-thought, ReAct, tree-of-thought", desc:"10x your output quality with the same model", tag:"hot", resources:[{name:"Prompt Engineering Guide (free)",platform:"promptingguide.ai",url:"https://www.promptingguide.ai/",icon:"PE"}]},
      { id:"ga_03", name:"RAG — Retrieval Augmented Generation, chunking strategies, reranking, hybrid search", desc:"The most deployed LLM pattern in production in 2024–2025", tag:"hot", resources:[{name:"LangChain RAG Tutorial (free)",platform:"python.langchain.com",url:"https://python.langchain.com/docs/tutorials/rag/",icon:"LC"}]},
      { id:"ga_04", name:"Fine-tuning — LoRA, QLoRA, PEFT, instruction tuning, alignment", desc:"Adapting LLMs to your domain without full pretraining cost", tag:"hot", resources:[{name:"HuggingFace PEFT docs (free)",platform:"huggingface.co",url:"https://huggingface.co/docs/peft",icon:"HF"}]},
      { id:"ga_05", name:"LangChain / LlamaIndex — chains, agents, memory, tools, structured outputs", desc:"The frameworks that power most LLM applications", tag:"hot", resources:[{name:"LangChain official docs (free)",platform:"python.langchain.com",url:"https://python.langchain.com/",icon:"LC"}]},
      { id:"ga_06", name:"Diffusion models — DDPM, score-based, stable diffusion, ControlNet", desc:"The architecture behind image generation (DALL-E, Stable Diffusion, Midjourney)", tag:"hot", resources:[{name:"The Annotated Diffusion Model (free)",platform:"huggingface.co blog",url:"https://huggingface.co/blog/annotated-diffusion",icon:"HF"}]},
      { id:"ga_07", name:"LLM evaluation — BLEU, ROUGE, LLM-as-judge, BERTScore, hallucination detection", desc:"You can't improve what you can't measure — especially hallucinations", tag:"hot", resources:[{name:"HuggingFace Evaluate docs (free)",platform:"huggingface.co/evaluate",url:"https://huggingface.co/docs/evaluate/index",icon:"HF"}]},
      { id:"ga_08", name:"AI agents — ReAct, tool-use, function calling, multi-agent systems, CrewAI", desc:"The hottest area in applied GenAI right now — 2025", tag:"hot", resources:[{name:"DeepLearning.AI AI Agents Course (free)",platform:"deeplearning.ai",url:"https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",icon:"DL"}]}
    ]
  },
  {
    id: "mlops",
    title: "MLOps & Deployment",
    phase: "Phase 4 · Days 45–50 · Metal",
    element: "metal",
    skills: [
      { id:"op_01", name:"FastAPI — build a model serving REST API, async, Pydantic validation", desc:"Standard Python API framework for serving ML models", tag:"core", resources:[{name:"FastAPI Official Tutorial (free)",platform:"fastapi.tiangolo.com",url:"https://fastapi.tiangolo.com/tutorial/",icon:"FP"}]},
      { id:"op_02", name:"Docker — Dockerfile, images, containers, docker-compose, GPU support", desc:"Non-negotiable for every deployed ML system in 2025", tag:"core", resources:[{name:"Docker Official Get Started (free)",platform:"docs.docker.com",url:"https://docs.docker.com/get-started/",icon:"DK"},{name:"TechWorld with Nana — Docker full course",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=3c-iBn73dDE",icon:"YT"}]},
      { id:"op_03", name:"Git & GitHub — branching, pull requests, merge conflicts, git rebase, GitHub Actions", desc:"Absolute baseline for any tech job — know it deeply", tag:"core", resources:[{name:"Pro Git book (free)",platform:"git-scm.com",url:"https://git-scm.com/book/en/v2",icon:"GT"}]},
      { id:"op_04", name:"Experiment tracking — MLflow, Weights & Biases — runs, metrics, model registry", desc:"Essential for serious, reproducible ML work", tag:"hot", resources:[{name:"MLflow Quickstart (free)",platform:"mlflow.org",url:"https://mlflow.org/docs/latest/quickstart.html",icon:"ML"},{name:"W&B quickstart (free tier)",platform:"wandb.ai",url:"https://docs.wandb.ai/quickstart",icon:"WB"}]},
      { id:"op_05", name:"Streamlit — build and deploy ML apps and interactive demos", desc:"Fastest way to ship something visible to your portfolio", tag:"hot", resources:[{name:"Streamlit official docs (free)",platform:"docs.streamlit.io",url:"https://docs.streamlit.io/",icon:"ST"}]},
      { id:"op_06", name:"CI/CD — GitHub Actions, automated testing, model validation pipelines", desc:"Production ML workflow — models should never ship untested", tag:"advanced", resources:[{name:"GitHub Actions Quickstart (free)",platform:"docs.github.com",url:"https://docs.github.com/en/actions/quickstart",icon:"GH"}]},
      { id:"op_07", name:"Cloud ML — AWS SageMaker or GCP Vertex AI — training jobs, endpoints, notebooks", desc:"All production ML runs on cloud — know at least one platform", tag:"advanced", resources:[{name:"AWS SageMaker Studio Lab (free tier)",platform:"studiolab.sagemaker.aws",url:"https://studiolab.sagemaker.aws/",icon:"AW"}]},
      { id:"op_08", name:"Model monitoring — data drift, concept drift, Evidently AI, Prometheus/Grafana", desc:"Models degrade silently without monitoring — this is often overlooked", tag:"advanced", resources:[{name:"Evidently AI (free, open source)",platform:"evidentlyai.com",url:"https://docs.evidentlyai.com/",icon:"EV"}]},
      { id:"op_09", name:"Model explainability — SHAP, LIME, permutation importance, partial dependence plots", desc:"Required for regulated industries — finance, insurance, healthcare", tag:"hot", resources:[{name:"SHAP documentation (free)",platform:"shap.readthedocs.io",url:"https://shap.readthedocs.io/en/latest/",icon:"SH"}]}
    ]
  },
  {
    id: "data_eng",
    title: "Data Engineering — Pipelines & Infrastructure",
    phase: "Phase 4 · Days 48–54 · Metal",
    element: "metal",
    skills: [
      { id:"de_01", name:"Apache Spark — RDDs, DataFrames, PySpark, transformations, actions, lazy evaluation", desc:"Big data processing — essential for all pipeline-heavy DS/ML roles", tag:"hot", resources:[{name:"PySpark Official Docs (free)",platform:"spark.apache.org",url:"https://spark.apache.org/docs/latest/api/python/getting_started/index.html",icon:"SP"},{name:"freeCodeCamp PySpark Tutorial",platform:"YouTube (free)",url:"https://www.youtube.com/watch?v=_C8kWso4ne4",icon:"YT"}]},
      { id:"de_02", name:"Apache Airflow — DAGs, operators, scheduling, sensors, XCom, TaskFlow API", desc:"Standard workflow orchestration for all data pipelines", tag:"hot", resources:[{name:"Airflow Official Tutorial (free)",platform:"airflow.apache.org",url:"https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html",icon:"AF"}]},
      { id:"de_03", name:"dbt — data build tool, models, tests, lineage, seeds, snapshots, macros", desc:"SQL-based transformation layer in every modern data stack", tag:"hot", resources:[{name:"dbt Learn (free)",platform:"courses.getdbt.com",url:"https://courses.getdbt.com/",icon:"DB"}]},
      { id:"de_04", name:"Apache Kafka — topics, producers, consumers, partitions, consumer groups, streaming", desc:"Real-time event streaming for ML feature pipelines and fraud detection", tag:"hot", resources:[{name:"Kafka Official Getting Started (free)",platform:"kafka.apache.org",url:"https://kafka.apache.org/quickstart",icon:"KF"},{name:"Confluent Kafka Fundamentals (free)",platform:"developer.confluent.io",url:"https://developer.confluent.io/learn-kafka/apache-kafka/events/",icon:"CF"}]},
      { id:"de_05", name:"Data warehousing — star schema, OLAP vs OLTP, partitioning, BigQuery, Redshift", desc:"Know how data is physically stored before you query or ML on it", tag:"core", resources:[{name:"Google BigQuery free sandbox",platform:"cloud.google.com",url:"https://cloud.google.com/bigquery/docs/sandbox",icon:"GC"}]},
      { id:"de_06", name:"ETL vs ELT — pipeline patterns, data lakes, medallion architecture (Bronze/Silver/Gold)", desc:"Modern data engineering design patterns", tag:"core", resources:[{name:"Databricks Medallion Architecture (free blog)",platform:"databricks.com",url:"https://www.databricks.com/glossary/medallion-architecture",icon:"DB"}]},
      { id:"de_07", name:"Feature stores — Feast, Hopsworks — online vs offline feature serving consistency", desc:"Training-serving skew kills models — feature stores solve this", tag:"advanced", resources:[{name:"Feast documentation (free)",platform:"docs.feast.dev",url:"https://docs.feast.dev/",icon:"FS"}]}
    ]
  },
  {
    id: "rl",
    title: "Reinforcement Learning",
    phase: "Phase 4 · Days 52–56 · Fire",
    element: "fire",
    skills: [
      { id:"rl_01", name:"RL fundamentals — MDP, state, action, reward, policy, value function, Bellman", desc:"The formal language of RL — understand every concept cold", tag:"core", resources:[{name:"David Silver RL Course (free)",platform:"YouTube",url:"https://www.youtube.com/watch?v=2pWv7GOvuf0&list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ",icon:"YT"},{name:"Spinning Up in RL — OpenAI (free)",platform:"spinningup.openai.com",url:"https://spinningup.openai.com/en/latest/",icon:"OA"}]},
      { id:"rl_02", name:"Q-learning — Q-table, Bellman equation, epsilon-greedy exploration vs exploitation", desc:"Classic tabular RL — build the foundation before deep RL", tag:"core", resources:[{name:"Q-learning explained — freeCodeCamp (free)",platform:"YouTube",url:"https://www.youtube.com/watch?v=qhRNvCVVJaA",icon:"YT"}]},
      { id:"rl_03", name:"Deep Q-Networks (DQN) — experience replay, target networks, double DQN, Atari games", desc:"DeepMind's 2015 breakthrough — RL meets deep learning", tag:"advanced", resources:[{name:"Stable-Baselines3 docs (free)",platform:"stable-baselines3.readthedocs.io",url:"https://stable-baselines3.readthedocs.io/en/master/",icon:"SB"}]},
      { id:"rl_04", name:"Policy gradient methods — REINFORCE, PPO, Actor-Critic (A2C/A3C), SAC", desc:"State-of-the-art RL for continuous action spaces — robotics, games", tag:"advanced", resources:[{name:"Spinning Up Policy Gradients (free)",platform:"spinningup.openai.com",url:"https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html",icon:"OA"}]},
      { id:"rl_05", name:"RLHF — Reinforcement Learning from Human Feedback, reward modelling, PPO alignment", desc:"How ChatGPT, Claude, and Gemini were trained — top interview topic", tag:"hot", resources:[{name:"Hugging Face RLHF Blog (free)",platform:"huggingface.co",url:"https://huggingface.co/blog/rlhf",icon:"HF"}]},
      { id:"rl_06", name:"Gymnasium / OpenAI Gym — environments, wrappers, custom environments", desc:"Standard interface for all RL experimentation and research", tag:"core", resources:[{name:"Gymnasium documentation (free)",platform:"gymnasium.farama.org",url:"https://gymnasium.farama.org/",icon:"GY"}]}
    ]
  },
  {
    id: "ethics",
    title: "AI Ethics, Fairness & Responsible AI",
    phase: "Phase 5 · Days 55–58 · Water",
    element: "water",
    skills: [
      { id:"et_01", name:"Bias in ML — data bias, label bias, historical bias, representation bias, feedback loops", desc:"Models amplify every bias in training data — know every source type", tag:"hot", resources:[{name:"Google ML Fairness crash course (free)",platform:"developers.google.com",url:"https://developers.google.com/machine-learning/crash-course/fairness/video-lecture",icon:"GC"},{name:"Fairness and Machine Learning book (free)",platform:"fairmlbook.org",url:"https://fairmlbook.org/",icon:"BK"}]},
      { id:"et_02", name:"Fairness metrics — demographic parity, equalised odds, calibration, individual fairness", desc:"Quantifying fairness — increasingly tested in interviews and required by law", tag:"hot", resources:[{name:"Fairlearn documentation (free)",platform:"fairlearn.org",url:"https://fairlearn.org/v0.8/user_guide/index.html",icon:"FL"}]},
      { id:"et_03", name:"Model interpretability — SHAP, LIME, counterfactuals, feature attribution methods", desc:"Regulators and users demand explainable AI decisions", tag:"hot", resources:[{name:"Interpretable ML book (free)",platform:"christophm.github.io",url:"https://christophm.github.io/interpretable-ml-book/",icon:"BK"}]},
      { id:"et_04", name:"Privacy-preserving ML — differential privacy, federated learning, data anonymisation", desc:"GDPR, HIPAA, CCPA — these are now legal requirements in many industries", tag:"advanced", resources:[{name:"TensorFlow Privacy (free)",platform:"github.com/tensorflow/privacy",url:"https://github.com/tensorflow/privacy",icon:"GH"}]},
      { id:"et_05", name:"EU AI Act & regulatory landscape — risk categories, compliance, documentation", desc:"2025 reality — AI is now regulated by law across Europe and beyond", tag:"hot", resources:[{name:"EU AI Act summary (free)",platform:"artificialintelligenceact.eu",url:"https://artificialintelligenceact.eu/",icon:"EU"}]},
      { id:"et_06", name:"Model cards & data sheets — documenting ML systems for transparency and governance", desc:"Best practice for any production model — increasingly required", tag:"core", resources:[{name:"Google Model Card Toolkit (free)",platform:"github.com/google",url:"https://github.com/google/model-card-toolkit",icon:"GC"}]}
    ]
  },
  {
    id: "graph_ml",
    title: "Graph ML & Graph Neural Networks",
    phase: "Phase 5 · Days 57–61 · Lightning",
    element: "lightning",
    skills: [
      { id:"gml_01", name:"Graph theory basics — nodes, edges, adjacency matrix, degree, paths, cycles, trees", desc:"The vocabulary of graph ML — foundation before GNNs", tag:"core", resources:[{name:"CS224W Stanford Graph ML (free)",platform:"web.stanford.edu/class/cs224w",url:"https://web.stanford.edu/class/cs224w/",icon:"ST"}]},
      { id:"gml_02", name:"Graph analytics — centrality, clustering coefficient, PageRank, community detection, Louvain", desc:"Classic graph features used in fraud detection and social network analysis", tag:"core", resources:[{name:"NetworkX documentation (free)",platform:"networkx.org",url:"https://networkx.org/documentation/stable/tutorial.html",icon:"NX"}]},
      { id:"gml_03", name:"Graph Neural Networks — message passing, GCN, GraphSAGE, GAT, GIN", desc:"Rapidly growing in fraud detection, drug discovery, and knowledge graphs", tag:"hot", resources:[{name:"CS224W Lecture Notes (free)",platform:"cs224w.stanford.edu",url:"https://web.stanford.edu/class/cs224w/",icon:"ST"},{name:"PyTorch Geometric docs (free)",platform:"pytorch-geometric.readthedocs.io",url:"https://pytorch-geometric.readthedocs.io/",icon:"PT"}]},
      { id:"gml_04", name:"Knowledge graphs — entity linking, relation extraction, graph embeddings (TransE, RotatE)", desc:"Google, Amazon, Meta all use knowledge graphs at massive scale", tag:"advanced", resources:[{name:"Wikidata for knowledge graphs (free)",platform:"wikidata.org",url:"https://www.wikidata.org/wiki/Wikidata:Main_Page",icon:"WD"}]},
      { id:"gml_05", name:"Graph ML applications — fraud detection, social networks, recommendation on graphs", desc:"Apply GNNs to real problems that companies actually deploy", tag:"hot", resources:[{name:"DGL Graph Learning docs (free)",platform:"docs.dgl.ai",url:"https://docs.dgl.ai/",icon:"DG"}]}
    ]
  },
  {
    id: "capstones",
    title: "Capstone Projects — Build Your Portfolio",
    phase: "Phase 5 · Days 59–65 · All Elements",
    element: "void",
    skills: [
      { id:"cp_01", name:"Project 1 — End-to-end tabular ML: train, tune, explain, deploy as API with monitoring", desc:"Kaggle-style dataset → XGBoost → FastAPI endpoint → Streamlit demo → MLflow tracking", tag:"core", resources:[{name:"Kaggle Datasets (free)",platform:"kaggle.com/datasets",url:"https://www.kaggle.com/datasets",icon:"KG"},{name:"Made With ML — project structure (free)",platform:"madewithml.com",url:"https://madewithml.com/",icon:"MW"}]},
      { id:"cp_02", name:"Project 2 — NLP pipeline: collect data, fine-tune BERT, build text classifier or NER system", desc:"Sentiment analysis, NER, or document classification — deployed on HuggingFace Spaces", tag:"hot", resources:[{name:"HuggingFace example projects (free)",platform:"huggingface.co",url:"https://huggingface.co/docs/transformers/notebooks",icon:"HF"}]},
      { id:"cp_03", name:"Project 3 — RAG application: ingest PDFs, embed, retrieve, answer questions with an LLM", desc:"The most in-demand GenAI portfolio piece — build it properly with evaluation", tag:"hot", resources:[{name:"LangChain RAG demo (free)",platform:"python.langchain.com",url:"https://python.langchain.com/docs/tutorials/rag/",icon:"LC"}]},
      { id:"cp_04", name:"Project 4 — Data pipeline: ingest with Airflow, transform with dbt, serve a dashboard", desc:"Shows data engineering depth — crucial for ML engineer and data engineer roles", tag:"advanced", resources:[{name:"dbt + Airflow tutorial (free)",platform:"docs.getdbt.com",url:"https://docs.getdbt.com/guides",icon:"DB"}]},
      { id:"cp_05", name:"Project 5 — CV: object detection or image classifier deployed as Gradio app", desc:"YOLOv8 inference API or fine-tuned ViT — hosted free on HuggingFace Spaces", tag:"hot", resources:[{name:"HuggingFace Spaces (free hosting)",platform:"huggingface.co/spaces",url:"https://huggingface.co/spaces",icon:"HF"}]},
      { id:"cp_06", name:"GitHub portfolio — clean READMEs, model cards, requirements.txt, reproducible notebooks", desc:"Your portfolio is the interview before the interview — make it immaculate", tag:"core", resources:[{name:"GitHub Pages (free hosting)",platform:"pages.github.com",url:"https://pages.github.com/",icon:"GH"}]}
    ]
  },
  {
    id: "soft",
    title: "Communication, Storytelling & Interview Prep",
    phase: "Phase 5 · Days 63–65 · Wind",
    element: "wind",
    skills: [
      { id:"so_01", name:"Translating model results to business impact — metrics that non-technical execs understand", desc:"The most underrated skill that separates senior DS from junior", tag:"core", resources:[{name:"Storytelling with Data (free blog)",platform:"storytellingwithdata.com",url:"https://www.storytellingwithdata.com/blog",icon:"BL"}]},
      { id:"so_02", name:"Dashboard building — Tableau Public, Power BI, Metabase, or Grafana", desc:"Communicating insights visually to stakeholders", tag:"core", resources:[{name:"Tableau Public (free)",platform:"public.tableau.com",url:"https://public.tableau.com/",icon:"TB"},{name:"Power BI Desktop (free)",platform:"microsoft.com",url:"https://powerbi.microsoft.com/desktop/",icon:"PB"}]},
      { id:"so_03", name:"ML system design — designing end-to-end ML systems for senior product interviews", desc:"Required at mid-senior ML engineer level at most top companies", tag:"hot", resources:[{name:"Chip Huyen ML Interviews book (free)",platform:"huyenchip.com",url:"https://huyenchip.com/ml-interviews-book/",icon:"BK"},{name:"Made With ML — MLOps Design (free)",platform:"madewithml.com",url:"https://madewithml.com/",icon:"MW"}]},
      { id:"so_04", name:"Interview grind — DS statistics Q&A, ML concept questions, SQL coding, case studies", desc:"Dedicated daily practice in the final phase — no days off", tag:"core", resources:[{name:"Nick Singh — DS Interview Q&A (free)",platform:"nicksingh.com",url:"https://www.nicksingh.com/posts/40-probability-statistics-data-science-interview-questions-asked-by-fang-wall-street",icon:"BL"},{name:"Pramp — free mock interviews",platform:"pramp.com",url:"https://www.pramp.com/",icon:"PM"}]},
      { id:"so_05", name:"Presenting findings to non-technical stakeholders — clarity, empathy, business framing", desc:"Empathy + clarity — practice presenting every week", tag:"core", resources:[{name:"Google Slides or Canva (free)",platform:"canva.com",url:"https://www.canva.com/",icon:"CV"}]}
    ]
  }
];
