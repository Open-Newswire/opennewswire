"use client";

import {
  Badge,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { Article } from "@prisma/client";
import { format } from "date-fns";

export function StoriesTable({ items }: { items: Article[] }) {
  const rows = items.map(
    ({ id, title, link, author, date, content, isHidden }) => {
      return (
        <TableTr key={id}>
          <TableTd>
            <a target="_blank" rel="norefer" href={link!}>
              {title}
            </a>
            {isHidden ? (
              <Badge variant="light" color="gray" size="sm">
                Hidden
              </Badge>
            ) : null}
          </TableTd>
          <TableTd>{author}</TableTd>
          <TableTd>{format(date!, "PP p")}</TableTd>
          <TableTd>{content}</TableTd>
        </TableTr>
      );
    },
  );

  return (
    <Table my="md" layout="fixed">
      <TableThead>
        <TableTr>
          <TableTh w="35%">Title</TableTh>
          <TableTh w="10%">Author</TableTh>
          <TableTh w="15%">Publication Date</TableTh>
          <TableTh w="30%">Content</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
