<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19byL8J764QoXh6SpwdzH-4BxP5cxNH6b

## Run Locally

**Prerequisites:**  Node.js


# 🏥 ClearHealth: Intelligent Medical Report Analyzer

> **Winner/Entry for Google DeepMind "Vibe Code" Hackathon 2024**
> *Built with Gemini 3 Pro & Google AI Studio*

[![Gemini 3 Pro](https://img.shields.io/badge/AI-Gemini%203%20Pro-8E44AD?style=for-the-badge)](https://deepmind.google/technologies/gemini/)
[![Built with Vibe Coding](https://img.shields.io/badge/Built%20with-Vibe%20Coding-blue?style=for-the-badge)](https://aistudio.google.com/)

## 🎥 Project Demo
[Watch the 2-minute Demo Video Here](YOUR_VIDEO_LINK_HERE)

## 💡 The Problem
Medical reports are confusing. Patients often receive a PDF full of numbers like "Ferritin: 12 ng/mL" and have no idea if that is good, bad, or urgent. They are left anxious and confused until their next doctor's appointment.

## 🚀 The Solution
**ClearHealth** is a web application that "reads" medical reports for you.
1.  **Upload:** Drag & drop a photo/PDF of a blood test.
2.  **Analyze:** Gemini 3 Pro extracts the data and identifies "out of range" values.
3.  **Visualize:** It generates instant Gauge Charts to show exactly where you stand.
4.  **Reason:** Using "Deep Think," it correlates data points (e.g., Low Iron + Low Hb = Anemia Risk) to give personalized insights.

---

## 🛠️ How It Was Built (Vibe Coding)
I built this entire application using the **Google AI Studio "Build" Mode** (Vibe Coding).
* **Multimodality:** Used Gemini's vision capabilities to OCR complex table structures from raw images.
* **Deep Thinking:** Enabled reasoning capabilities to prevent the AI from just "reading" numbers—it actually *interprets* medical patterns.
* **System Instructions:** Implemented strict guardrails to ensure the AI never makes a definitive medical diagnosis and always advises consulting a professional.

## 📸 Screenshots
| Dashboard View | Deep Dive Analysis |
|:---:|:---:|
| ![Dashboard](https://placehold.co/600x400?text=Upload+Your+Screenshot+1) | ![Analysis](https://placehold.co/600x400?text=Upload+Your+Screenshot+2) |

## ⚠️ Disclaimer
**ClearHealth is a prototype for educational purposes only.** It is not a substitute for professional medical advice, diagnosis, or treatment.

## 🔗 Links
- [Try the Live App (AI Studio)][(https://ai.studio/apps/drive/19byL8J764QoXh6SpwdzH-4BxP5cxNH6b)]
- [Kaggle Submission](YOUR_KAGGLE_LINK_HERE)
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
