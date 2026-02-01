import { LanguageEditor } from "@/components/admin/languages/LanguageEditor";
import { SaveLanguageParams } from "@/domains/languages/schemas";
import { Language } from "@/domains/languages/types";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe } from "node:test";
import { expect, test, vi } from "vitest";

describe("adding a new language", () => {
  test("submits form with new language", async () => {
    const handleSubmit = vi.fn((language: SaveLanguageParams) =>
      Promise.resolve(),
    );
    render(<LanguageEditor onSubmit={handleSubmit} />);

    await act(() => {
      const nameInput = screen.getByRole("textbox", {
        name: /name/i,
      });
      fireEvent.change(nameInput, { target: { value: "Language" } });

      const slugInput = screen.getByRole("textbox", {
        name: /slug/i,
      });
      fireEvent.change(slugInput, { target: { value: "test-slug" } });

      const rtlCheckbox = screen.getByText(/right\-to\-left \(rtl\) language/i);
      fireEvent.click(rtlCheckbox);

      screen.getByRole("button", { name: /save/i }).click();
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      isRtl: true,
      slug: "test-slug",
      name: "Language",
    });
  });

  test("shows validation errors", async () => {
    const handleSubmit = vi.fn((language: SaveLanguageParams) =>
      Promise.resolve(),
    );
    render(<LanguageEditor onSubmit={handleSubmit} />);

    await act(() => {
      screen.getByText("Save").click();
    });

    expect(handleSubmit).toHaveBeenCalledTimes(0);
  });
});

describe("editing an existing language", () => {
  const existingLanguage: Language = {
    id: "test",
    name: "Test Language",
    slug: "test-slug",
    isRtl: true,
    createdAt: new Date(),
    order: 0,
  };

  test("populates form with existing language", async () => {
    const handleSubmit = vi.fn((language: SaveLanguageParams) =>
      Promise.resolve(),
    );
    render(
      <LanguageEditor onSubmit={handleSubmit} language={existingLanguage} />,
    );

    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    });
    const slugInput = screen.getByRole("textbox", {
      name: /slug/i,
    });
    const rtlCheckbox = screen.getByRole("checkbox");

    expect(nameInput).toHaveValue(existingLanguage.name);
    expect(slugInput).toHaveValue(existingLanguage.slug);
    expect(rtlCheckbox).toBeChecked();
  });
});
