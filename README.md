# ZEN MASTERY · 65-Day Lock-In

A personal, 65-day mastery path for Data Science, Machine Learning, Deep Learning, and Generative AI — built as a fully interactive web dashboard with real-time cloud sync.

**Live Site:** [lock-in-deepak.pages.dev](https://lock-in-deepak.pages.dev)

---

## What This Is

- A structured **139-skill curriculum** spread across 18 sections and 4 phases.
- A fully functional **web dashboard** with progress tracking, journals, statistics, and a smart timer.
- Password-protected with **Supabase Authentication** — your progress is safe and synced to the cloud in real-time.
- Designed as a solo "lock-in" grind — track daily progress from Day 1 to Day 65.

---

## Features

| Feature | Description |
|---|---|
| **Phases View** | Browse all 139 skills organized into collapsible sections with checkboxes, resource links, and progress bars. |
| **Roadmap View** | A visual timeline showing all sections as alternating cards with progress indicators. |
| **Stats Dashboard** | Journey timer, study pace, projected completion date, rank ladder, and section-by-section breakdown. |
| **Smart Timer** | Calculates where you *should* be vs where you *actually* are against the 65-day deadline. Motivates or reality-checks you accordingly. |
| **Resources** | Flashcard deck for quick revision and a "Daily Neuron" knowledge feed. |
| **Journal** | Per-day journaling with autosave. Write about what you learned, what clicked, and what you struggled with. Entries sync to Supabase in real-time. |
| **Beta (Stubs)** | An experimental UpNext-style page with a ticket stub for your current section, a book shelf of completed sections, and top conquest cards. |
| **Cloud Sync** | All progress (checked skills, start date, journals) syncs to Supabase in real-time. Open in two tabs — changes appear instantly. |
| **Authentication** | Email/password login via Supabase Auth. Row Level Security ensures only you can access your data. |

---

## Phases

### Phase 1 · Foundations (Days 1–10)
Python Fundamentals, Python for Data Science (NumPy, Pandas, Matplotlib), SQL & Databases, Statistics & Probability, Math for ML.

### Phase 2 · Core ML (Days 11–22)
Data Wrangling & EDA, Core ML Algorithms (regression, trees, boosting, SVM, clustering), Evaluation & Tuning, sklearn Pipelines, Time Series.

### Phase 3 · Deep Learning, NLP, CV, GenAI (Days 23–50)
Neural Networks & Backprop, CNNs, RNN/LSTM, Transformers, PyTorch, NLP (HuggingFace, NER, Semantic Search), Computer Vision, Generative AI & LLMs (RAG, LoRA, LangChain, AI Agents, Diffusion Models).

### Phase 4 · Deploy & Ship (Days 51–65)
MLOps (FastAPI, Docker, MLflow), Data Engineering, Reinforcement Learning, AI Ethics, Graph ML, Capstone Projects, Soft Skills & Interview Prep.

---

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **Styling:** Custom CSS + utility classes
- **Backend:** [Supabase](https://supabase.com) (PostgreSQL + Auth + Realtime)
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com)
- **Fonts:** Geist Sans & Geist Mono

---

## Local Development

1. Clone this repo.
2. Open `index.html` in a browser — that's it. No build step required.
3. To enable cloud sync, you need a Supabase project with a `journals` table and Row Level Security enabled.

---

> *65 days. 139 skills. One path. Lock in.*
