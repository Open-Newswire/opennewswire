"use client";

import { ccsymbols } from "@/app/fonts";
import {
  AppShellSection,
  Checkbox,
  CheckboxGroup,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Language, License } from "@prisma/client";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export function Sidebar({
  languages,
  licenses,
}: {
  languages: Language[];
  licenses: License[];
}) {
  const [selectedLicenses, setSelectedLicenses] = useQueryState(
    "licenses",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      shallow: false,
      scroll: true,
    }),
  );
  const [selectedLanguages, setSelectedLanguages] = useQueryState(
    "languages",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      shallow: false,
      scroll: true,
    }),
  );

  return (
    <AppShellSection grow component={ScrollArea} px="lg">
      <Text size="sm" fw="600" mt="lg">
        Licenses
      </Text>
      <Checkbox
        my="xs"
        label="All Licenses"
        checked={selectedLicenses?.length === 0}
        onChange={() => setSelectedLicenses([])}
      />
      <CheckboxGroup
        value={selectedLicenses}
        onChange={(newSelection) => setSelectedLicenses(newSelection)}
      >
        {licenses.map((l: License) => (
          <Checkbox
            my="xs"
            key={l.id}
            label={
              <span>
                {l.name}
                {l.symbols ? (
                  <span
                    className={ccsymbols.className}
                    style={{
                      fontSize: "1.2rem",
                      verticalAlign: "bottom",
                      marginLeft: "0.4rem",
                      letterSpacing: "0.2rem",
                    }}
                  >
                    {l.symbols}
                  </span>
                ) : null}
              </span>
            }
            value={l.slug ?? ""}
            color={l.backgroundColor}
            autoContrast={true}
          />
        ))}
      </CheckboxGroup>
      <Text size="sm" fw="600" mt="lg">
        Languages
      </Text>
      <Checkbox
        my="xs"
        label="All Languages"
        checked={selectedLanguages?.length === 0}
        onChange={() => setSelectedLanguages([])}
      />
      <CheckboxGroup
        value={selectedLanguages}
        onChange={(newSelection) => setSelectedLanguages(newSelection)}
        pb="lg"
      >
        {languages.map((l: any) => (
          <Checkbox my="xs" key={l.id} label={l.name} value={l.slug ?? ""} />
        ))}
      </CheckboxGroup>
    </AppShellSection>
  );
}
