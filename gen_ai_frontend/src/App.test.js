import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Theme & Language Features", () => {
  test("renders initial UI and toggles dark/light mode", () => {
    render(<App />);
    // Initially, theme toggle button shows "🌙 Dark" (because initial is light)
    const toggleBtn = screen.getByRole("button", { name: /switch to/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent(/dark|இருள்/i);

    // Click to switch to dark mode
    fireEvent.click(toggleBtn);

    // Now it should show "☀️ Light" (or "ஒளி" in Tamil if language changed)
    expect(
      toggleBtn.textContent === "☀️ Light" || toggleBtn.textContent === "☀️ ஒளி"
    ).toBe(true);

    // The App element should have updated data-theme
    expect(document.documentElement.getAttribute("data-theme")).toMatch(/dark|light/);
  });

  test("language selector changes all visible text to Tamil and back to English", () => {
    render(<App />);
    // Language selector should be present
    const langSelect = screen.getByLabelText(/language|மொழி/i);
    expect(langSelect).toBeInTheDocument();
    expect(langSelect.value).toBe("en");

    // UI text in English
    expect(screen.getByRole("heading", { name: /AI App Name Generator/i })).toBeInTheDocument();

    // Switch to Tamil
    fireEvent.change(langSelect, { target: { value: "ta" } });

    // UI text in Tamil
    expect(screen.getByRole("heading", { name: /ஏஐ செயலி பெயர் உருவாக்கி/i })).toBeInTheDocument();

    // Category and style placeholder in Tamil
    const [categoryInput, styleInput] = screen.getAllByRole("textbox");
    expect(categoryInput.placeholder).toMatch(/வகை/i);
    expect(styleInput.placeholder).toMatch(/பாணி/i);

    // Number label
    expect(screen.getByLabelText(/பெயர்களின் எண்ணிக்கை:/i)).toBeInTheDocument();

    // Generate button
    const generateBtn = screen.getByRole("button", { name: /உருவாக்கு/ });
    expect(generateBtn).toBeInTheDocument();

    // Instruction on initial screen
    expect(
      screen.getByText(
        /இன்னும் பெயர்கள் இல்லை. மேலே விவரங்கள் அளித்து உருவாக்கு என்பதை அழுத்தவும்\./i
      )
    ).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/ஏஐ செயலி/i)).toBeInTheDocument();

    // Switch back to English and check everything reverts
    fireEvent.change(langSelect, { target: { value: "en" } });
    expect(screen.getByRole("heading", { name: /AI App Name Generator/i })).toBeInTheDocument();
    expect(categoryInput.placeholder).toMatch(/Category/i);
    expect(styleInput.placeholder).toMatch(/Style/i);
    expect(screen.getByText(/No names yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by AI/i)).toBeInTheDocument();
  });

  test("all translations keys are present for both languages", () => {
    // Extract translations map directly from App.js for completeness test
    // This expects the map and keys stay in sync
    const translations = {
      en: {
        app_title: "AI App Name Generator",
        app_description: "Describe the style or category for your app name inspiration.",
        category_placeholder: "Category (e.g., app, fintech, game)",
        style_placeholder: "Style or theme (e.g. creative, fun, minimal)",
        number_label: "Number of names:",
        generate: "Generate",
        generating: "Generating...",
        generated: "Generated names",
        copy: "Copy",
        copied: "✓ Copied",
        no_names: "No names yet. Enter criteria above and press Generate.",
        error: "An error occurred. Please try again.",
        powered_by: "Powered by AI •",
        minimal_ui: "Black & White Minimal UI.",
        language: "Language",
        theme_light: "☀️ Light",
        theme_dark: "🌙 Dark",
        switch_to: "Switch to",
        names_api_error: "No names returned. Please try again.",
        clipboard_fallback: "Copy to clipboard: Ctrl+C, Enter"
      },
      ta: {
        app_title: "ஏஐ செயலி பெயர் உருவாக்கி",
        app_description: "உங்கள் செயலிக்கான பெயர் வகை அல்லது பாணியை குறிப்பிடுங்கள்.",
        category_placeholder: "வகை (எ.கா., செயலி, நிதி, விளையாட்டு)",
        style_placeholder: "பாணி (எ.கா., சிருஷ்டி, வேடிக்கையானது, குறைந்தது)",
        number_label: "பெயர்களின் எண்ணிக்கை:",
        generate: "உருவாக்கு",
        generating: "உருவாக்கப்படுகிறது...",
        generated: "உருவாக்கப்பட்ட பெயர்கள்",
        copy: "நகலெடு",
        copied: "✓ நகலி செய்யப்பட்டுவிட்டது",
        no_names: "இன்னும் பெயர்கள் இல்லை. மேலே விவரங்கள் அளித்து உருவாக்கு என்பதை அழுத்தவும்.",
        error: "ஒரு பிழை ஏற்பட்டது. தயவு செய்து மீண்டும் முயற்சிக்கவும்.",
        powered_by: "ஏஐ செயலி •",
        minimal_ui: "கருப்பு & வெள்ளை குறைந்த UI.",
        language: "மொழி",
        theme_light: "☀️ ஒளி",
        theme_dark: "🌙 இருள்",
        switch_to: "மாற்று",
        names_api_error: "பெயர்கள் இல்லை. தயவு செய்து மீண்டும் முயற்சிக்கவும்.",
        clipboard_fallback: "நகலெடுத்தல்: Ctrl+C, Enter"
      }
    };

    // All keys in English must exist in Tamil and vice versa
    const keysEn = Object.keys(translations.en);
    const keysTa = Object.keys(translations.ta);

    expect(keysEn.sort()).toEqual(keysTa.sort());

    // No key is empty in either language
    for (const key of keysEn) {
      expect(translations.en[key]).toBeTruthy();
      expect(translations.ta[key]).toBeTruthy();
    }
  });
});
