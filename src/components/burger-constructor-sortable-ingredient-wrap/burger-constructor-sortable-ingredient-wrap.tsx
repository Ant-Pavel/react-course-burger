import React, { useRef } from 'react';
// import styles from './burger-constructor-sortable-ingredient-wrap.module.css';
import { useDrag, useDrop } from 'react-dnd';
import type { XYCoord } from 'react-dnd';
import { useAppDispatch } from '@/services/store';
import type { AppDispatch } from '../../services/store';
import { moveIngredient } from '../../services/burgerConstructor';

interface IBurgerConstructorSortableIngredientWrapProps {
	id: string;
	index: number;
	children?: React.ReactNode;
}

interface IdraggedItem {
	id: string;
	index: number;
}

interface IDragCollectedProps {
	isDragging: boolean;
}

export const BurgerConstructorSortableIngredientWrap = ({
	id,
	index,
	children,
}: IBurgerConstructorSortableIngredientWrapProps): React.JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const dispatch: AppDispatch = useAppDispatch();

	const [, dropRef] = useDrop<IdraggedItem, unknown, unknown>({
		accept: 'burgerConstructorSortableItem',
		hover(item: IdraggedItem, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;
			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}

			if (!ref.current) return;
			// Determine rectangle on screen
			const hoverBoundingRect = ref.current.getBoundingClientRect();
			// Get vertical middle
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			// Determine mouse position
			const clientOffset = monitor.getClientOffset() as XYCoord;
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			// Time to actually perform the action
			// moveCard(dragIndex, hoverIndex);
			dispatch(moveIngredient({ toIndex: hoverIndex, fromIndex: dragIndex }));
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, dragRef] = useDrag<
		IdraggedItem,
		unknown,
		IDragCollectedProps
	>({
		item: { id, index },
		type: 'burgerConstructorSortableItem',
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	const opacity = isDragging ? 0 : 1;
	dragRef(dropRef(ref));
	return (
		<div style={{ opacity }} ref={ref}>
			{children}
		</div>
	);
};
