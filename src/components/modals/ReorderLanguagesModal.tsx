"use client";

import { reorderLanguages } from "@/actions/languages";
import { Language } from "@/types/languages";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
} from "@hello-pangea/dnd";
import { Box, Button, Group, rem, Text } from "@mantine/core";
import { useListState, useToggle } from "@mantine/hooks";
import { ContextModalProps } from "@mantine/modals";
import { IconGripVertical } from "@tabler/icons-react";
import { useEffect } from "react";
import classes from "./reorder-language-modal.module.css";

const getRenderItem =
  (items: Language[]) =>
  // eslint-disable-next-line react/display-name
  (
    provided: DraggableProvided,
    _: DraggableStateSnapshot,
    rubric: DraggableRubric<string>,
  ) => (
    <Box
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={classes.item}
    >
      <Text size="sm">{items[rubric.source.index].name}</Text>
      <IconGripVertical
        style={{ width: rem(18), height: rem(18) }}
        stroke={1.5}
      />
    </Box>
  );

export function ReorderLanguagesModal({ context, id }: ContextModalProps) {
  const [languages, handlers] = useListState<Language>();
  const [isLoading, setLoading] = useToggle();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/languages");
      const json = (await response.json()) as Language[];
      handlers.setState(json);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = getRenderItem(languages);

  function handleResetSort() {
    handlers.setState((prevState) =>
      [...prevState].sort((a, b) => (a.name > b.name ? 1 : -1)),
    );
  }

  async function handleSave() {
    setLoading(true);
    await reorderLanguages(
      languages.map((language, index) => ({ id: language.id, order: index })),
    );
    context.closeModal(id);
  }

  return (
    <Box>
      <Text size="sm">
        Drag languages to reorder their appearance in the feed reader.
      </Text>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          handlers.reorder({
            from: source.index,
            to: destination?.index || 0,
          });
        }}
      >
        <Droppable
          droppableId="dnd-list"
          direction="vertical"
          renderClone={renderItem}
        >
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.scrollContainer}
            >
              {languages.map((language, index) => (
                <Draggable
                  key={language.id}
                  draggableId={language.id}
                  index={index}
                >
                  {renderItem}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Group justify="space-between">
        <Button variant="default" onClick={handleResetSort}>
          Reset to Alphabetical Order
        </Button>
        <Button loading={isLoading} onClick={handleSave}>
          Save
        </Button>
      </Group>
    </Box>
  );
}
