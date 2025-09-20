"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Pencil } from "lucide-react";
import { Button } from "./button";

// Drag Handle Component
export const DragHandle = () => {
  return (
    <div className="flex items-center justify-center px-1">
      <GripVertical className="h-3.5 w-3.5 text-gray-400" />
    </div>
  );
};

// Sortable Item Component
export const SortableItem = React.memo(
  ({ id, item, onDelete, onEdit, renderItem }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 1 : 0,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center justify-between p-2.5 mb-2 bg-white rounded-md border ${
          isDragging ? "border-blue-200 shadow-sm" : "border-gray-100"
        } hover:border-gray-200 transition-colors`}
      >
        <div className="flex items-center flex-1">
          <div {...attributes} {...listeners}>
            <DragHandle />
          </div>
          <div className="flex-1">
            {renderItem ? (
              renderItem(item)
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-gray-500 text-xs">{item.link}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(id)}
              className="h-7 w-7 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              className="h-7 w-7 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

SortableItem.displayName = "SortableItem";

// Sortable Item Component that doesn't rely on useSortable (for the overlay)
export const Item = React.memo(({ item, renderItem }) => {
  return (
    <div className="flex items-center justify-between p-2.5 mb-2 bg-white rounded-md border border-blue-200 shadow-sm">
      <div className="flex items-center flex-1">
        <DragHandle />
        <div className="flex-1">
          {renderItem ? (
            renderItem(item)
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm">{item.name}</span>
              <span className="text-gray-500 text-xs">{item.link}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Item.displayName = "Item";

// Main Sortable List Component
export const SortableList = ({
  items,
  onChange,
  onDelete,
  onEdit,
  renderItem,
  idField = "_id",
}) => {
  const [activeId, setActiveId] = useState(null);
  const [internalItems, setInternalItems] = useState(items || []);

  // Update internalItems when external items change
  useEffect(() => {
    if (items && JSON.stringify(items) !== JSON.stringify(internalItems)) {
      setInternalItems(items);
    }
  }, [items]);

  // Handle deletion of items
  const handleDelete = useCallback((itemId) => {
    if (onDelete) {
      // Call the external delete handler
      onDelete(itemId);
    }
  }, [onDelete]);

  // Handle editing of items
  const handleEdit = useCallback((itemId) => {
    if (onEdit) {
      // Call the external edit handler
      onEdit(itemId);
    }
  }, [onEdit]);

  // Get the active item for the drag overlay
  const activeItem = activeId
    ? internalItems.find((item) => item[idField] === activeId)
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Distance in pixels required to activate
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = internalItems.findIndex(
          (item) => item[idField] === active.id
        );
        const newIndex = internalItems.findIndex(
          (item) => item[idField] === over.id
        );

        if (oldIndex === -1 || newIndex === -1) return;

        // Move the item in the array
        const newItems = arrayMove(internalItems, oldIndex, newIndex);

        // Update order values
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        // Update internal state
        setInternalItems(updatedItems);

        // Call the change handler with the new array and updated order indices
        if (onChange) {
          onChange(updatedItems);
        }
      }

      setActiveId(null);
    },
    [onChange, internalItems, idField]
  );

  // Stable item IDs
  const itemIds = React.useMemo(
    () => internalItems.map((item) => item[idField]),
    [internalItems, idField]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {internalItems.map((item) => (
            <SortableItem
              key={item[idField]}
              id={item[idField]}
              item={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
              renderItem={renderItem}
            />
          ))}
        </div>
      </SortableContext>

      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay adjustScale={false}>
            {activeId ? (
              <Item item={activeItem} renderItem={renderItem} />
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};
