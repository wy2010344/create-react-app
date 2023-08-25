import { forwardRef } from "../system";
import { UsePaginationItemProps, usePaginationItem } from "./use-pagination-item";




export interface PaginationItemProps extends UsePaginationItemProps { }

const PaginationItem = forwardRef<"li", PaginationItemProps>((props, ref) => {
  const { Component, children, getItemProps } = usePaginationItem({ ...props, ref });

  return <Component {...getItemProps()}>{children}</Component>;
});

PaginationItem.displayName = "NextUI.PaginationItem";

export default PaginationItem;