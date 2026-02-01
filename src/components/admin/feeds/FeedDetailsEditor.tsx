import { FeedBadge } from "@/components/admin/feeds/FeedBadge";
import { FeedIcon } from "@/components/admin/feeds/FeedIcon";
import { ModalFooter } from "@/components/shared/ModalFooter";
import { BlobUploader } from "@/components/shared/BlobUploader";
import { SaveFeedParams } from "@/domains/feeds/schemas";
import { ContentSourceDisplayNames, FeedPreview } from "@/domains/feeds/types";
import {
  Box,
  Button,
  Center,
  ColorInput,
  ComboboxData,
  Divider,
  DividerProps,
  Flex,
  Group,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { ContentSource, IconSource, Language, License } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";

const ContentSourceOptions: ComboboxData = [
  ContentSource.AUTOMATIC,
  ContentSource.CONTENT,
  ContentSource.CONTENT_SNIPPET,
  ContentSource.SUMMARY,
].map((value) => ({
  value,
  label: ContentSourceDisplayNames[value],
}));

function Section({
  children,
  ...props
}: { children: ReactNode } & DividerProps) {
  return (
    <>
      <Divider mt="xl" mb="sm" {...props} />
      <Text pb="xs" fw={600}>
        {children}
      </Text>
    </>
  );
}

export function FeedDetailsEditor({
  feed,
  onSave,
  onCancel,
}: {
  feed: Partial<SaveFeedParams & FeedPreview>;
  onSave: (values: SaveFeedParams) => void;
  onCancel: () => void;
}) {
  const [licenseSelectValues, setLicenseSelectValues] = useState<ComboboxData>(
    [],
  );
  const [languageSelectValues, setLanguageSelectValues] =
    useState<ComboboxData>([]);
  const form = useForm<SaveFeedParams>({
    initialValues: {
      url: feed.url ?? "",
      title: feed.title ?? "",
      iconUrl: feed.iconUrl,
      backgroundColor: feed.backgroundColor ?? "#000000",
      textColor: feed.textColor ?? "#ffffff",
      filterKeywords: feed.filterKeywords ?? "",
      licenseId: feed.licenseId,
      licenseText: feed.licenseText,
      licenseUrl: feed.licenseUrl,
      languageId: feed.languageId,
      iconSource:
        feed.iconSource ||
        (feed.iconUrl ? IconSource.FAVICON : IconSource.NONE),
      iconAssetUrl: feed.iconAssetUrl,
      contentSource: feed.contentSource ?? ContentSource.AUTOMATIC,
    },
    validate: {
      url: isNotEmpty("Enter a url"),
      title: isNotEmpty("Enter a title"),
    },
  });

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await fetch("/api/licenses");
      const json = (await response.json()) as License[];
      const selectValues = json.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setLicenseSelectValues(selectValues);
    };

    const fetchLanguages = async () => {
      const response = await fetch("/api/languages");
      const json = (await response.json()) as Language[];
      const selectValues = json.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setLanguageSelectValues(selectValues);
    };

    fetchLicenses();
    fetchLanguages();
  }, []);

  return (
    <form onSubmit={form.onSubmit(onSave)}>
      <Box>
        <Box flex="2">
          <Section mt="0">Basic Metadata</Section>
          <TextInput
            mt="md"
            label="URL"
            withAsterisk
            {...form.getInputProps("url")}
          />
          <TextInput
            mt="md"
            label="Title"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <Section>Appearance</Section>
          <Flex gap="lg">
            <Box flex="1">
              <ColorInput
                mt="md"
                label="Background Color"
                {...form.getInputProps("backgroundColor")}
              />
              <ColorInput
                mt="md"
                label="Text Color"
                {...form.getInputProps("textColor")}
              />
            </Box>
            <Box flex="1">
              <PreviewArea
                textColor={form.values.textColor}
                backgroundColor={form.values.backgroundColor}
                title={form.values.title}
                iconSource={form.values.iconSource}
                iconUrl={form.values.iconUrl}
                assetUrl={form.values.iconAssetUrl}
              />
            </Box>
          </Flex>
          <IconField
            iconSource={form.values.iconSource}
            setIconSource={(val) => form.setFieldValue("iconSource", val)}
            iconUrl={form.values.iconUrl}
            setIconUrl={(val) => form.setFieldValue("iconUrl", val)}
            iconAssetUrl={form.values.iconAssetUrl}
            setIconAssetUrl={(val) => form.setFieldValue("iconAssetUrl", val)}
          />
          <Section>License & Language</Section>
          <Group grow>
            <Select
              mt="md"
              label="Language Tag"
              data={languageSelectValues}
              {...form.getInputProps("languageId")}
            />
            <Select
              mt="md"
              label="License Tag"
              data={licenseSelectValues}
              {...form.getInputProps("licenseId")}
            />
          </Group>
          <TextInput
            mt="md"
            label="License Link"
            placeholder="https://link.to/license"
            {...form.getInputProps("licenseUrl")}
          />
          <Textarea
            mt="md"
            label="License Text"
            resize="vertical"
            rows={5}
            {...form.getInputProps("licenseText")}
          />
          <Section>Content & Filtering</Section>
          <Select
            mt="md"
            label="Article Content Source"
            data={ContentSourceOptions}
            {...form.getInputProps("contentSource")}
          />
          <Text size="xs" mt="sm" c="dimmed">
            Content source controls which RSS item element is mapped to an
            article&apos;s content.
            <br />
            <br />
            <ul>
              <li>
                <strong>Automatic</strong>: Open Newswire will choose the
                element based on availability
              </li>
              <li>
                <strong>Content</strong>: For Atom-based feeds, the{" "}
                <code>content</code> element is parsed. For RSS, the{" "}
                <code>description</code> element is parsed.
              </li>
              <li>
                <strong>Content Snippet</strong>: Same as &quot;Content&quot;,
                but the contents are stripped of any HTML tags contained within.
              </li>
              <li>
                <strong>Summary</strong>: For Atom-based feeds, the{" "}
                <code>summary</code> element is parsed. For RSS, this has no
                effect.
              </li>
            </ul>
          </Text>
          <TextInput
            mt="md"
            label="Filtered Keywords"
            {...form.getInputProps("filterKeywords")}
          />
          <Text size="xs" mt="sm" c="dimmed">
            Enter keywords separated by commas to hide articles. Articles with
            these keywords in their title, content, or author will not appear in
            the feed reader.
          </Text>
        </Box>
        <ModalFooter>
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </ModalFooter>
      </Box>
    </form>
  );
}

function PreviewArea({
  textColor,
  backgroundColor,
  title,
  iconSource,
  iconUrl,
  assetUrl,
}: {
  textColor?: string;
  iconSource: IconSource;
  iconUrl?: string | null;
  assetUrl?: string | null;
  backgroundColor?: string;
  title?: string;
}) {
  return (
    <Flex mt="lg" direction="column">
      <Text size="sm" fw={500}>
        Preview
      </Text>
      <Center
        p="md"
        bg="gray.1"
        style={{ borderRadius: "5px" }}
        flex="1"
        h="100%"
      >
        <Stack gap="xs" align="center" bg="gray.1">
          <FeedIcon
            source={iconSource}
            faviconUrl={iconUrl}
            assetUrl={assetUrl}
          />
          <FeedBadge
            feed={{
              textColor,
              backgroundColor,
              title,
            }}
          />
        </Stack>
      </Center>
    </Flex>
  );
}

function IconField({
  iconSource,
  setIconSource,
  iconUrl,
  setIconUrl,
  iconAssetUrl,
  setIconAssetUrl,
}: {
  iconSource: IconSource;
  setIconSource: (source: IconSource) => void;
  iconUrl?: string | null;
  setIconUrl: (url?: string) => void;
  iconAssetUrl?: string | null;
  setIconAssetUrl: (url?: string) => void;
}) {
  return (
    <Box mt="lg">
      <InputLabel>Icon</InputLabel>
      <RadioGroup
        value={iconSource}
        onChange={(val) => setIconSource(val as unknown as IconSource)}
      >
        <Radio label="None" value={IconSource.NONE} my="xs" />
        <Radio label="Website Favicon" value={IconSource.FAVICON} my="xs" />
        <TextInput
          value={iconUrl ?? ""}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="Favicon url"
          ml="xl"
          disabled={iconSource !== IconSource.FAVICON}
        />
        <Radio label="Custom Icon" value={IconSource.UPLOAD} my="xs" />
        <BlobUploader
          assetIconUrl={iconAssetUrl}
          onAssetIconUrlChange={setIconAssetUrl}
          description="Square images 64x64 px or smaller recommended"
          placeholder="Choose file"
          ml="xl"
          disabled={iconSource !== IconSource.UPLOAD}
          accept="image/png,image/jpeg,image/gif"
        />
      </RadioGroup>
    </Box>
  );
}
