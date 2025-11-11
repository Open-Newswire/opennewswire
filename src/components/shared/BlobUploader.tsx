import { FileInput, FileInputProps, Progress, Text } from "@mantine/core";
import { upload } from "@vercel/blob/client";
import { useState } from "react";

export function BlobUploader(
  props: FileInputProps & {
    assetIconUrl?: string | null;
    onAssetIconUrlChange: (url?: string) => void;
  },
) {
  const [file, setFile] = useState<File | null>(
    props.assetIconUrl ? new File([], props.assetIconUrl) : null,
  );
  const [progress, setProgress] = useState<number | null>(null);

  async function uploadFile(file: File | null) {
    if (!file) {
      setFile(null);
      props.onAssetIconUrlChange(undefined);
      return;
    }

    setProgress(0);
    setFile(file);

    const newBlob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/uploads/feed-logo",
      onUploadProgress: (e) => {
        setProgress(e.percentage);
      },
    });

    setProgress(null);
    props.onAssetIconUrlChange(newBlob.url);

    console.log(newBlob);
  }

  return (
    <FileInput
      {...props}
      onChange={uploadFile}
      value={file}
      description="Square images 32x32 px or smaller recommended"
      placeholder="Choose file"
      clearable
      valueComponent={(e) => (
        <ValueComponent
          file={e.value}
          progress={progress}
          assetIconUrl={props.assetIconUrl}
        />
      )}
    />
  );
}

function ValueComponent({
  file,
  progress,
  assetIconUrl,
}: {
  file: File | File[] | null;
  progress: number | null;
  assetIconUrl?: string | null;
}) {
  if (progress) {
    return <Progress value={progress} />;
  }

  if (assetIconUrl) {
    return (
      <Text size="sm" style={{ overflowWrap: "break-word" }}>
        {assetIconUrl}
      </Text>
    );
  }

  if (file instanceof File) {
    return <Progress value={0} />;
  }

  return null;
}
