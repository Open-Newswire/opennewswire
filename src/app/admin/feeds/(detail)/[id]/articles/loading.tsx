import {
  Skeleton,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";

export default function Loading() {
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
      <TableTbody>
        <TableTr>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
        </TableTr>
        <TableTr>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
        </TableTr>
        <TableTr>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
        </TableTr>
        <TableTr>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
        </TableTr>
        <TableTr>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
        </TableTr>
        <TableTr>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
          <TableTd>
            <Skeleton height={8} mt={6} radius="xl" />
          </TableTd>
        </TableTr>
      </TableTbody>
    </Table>
  );
}
