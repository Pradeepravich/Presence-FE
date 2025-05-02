import { Box } from "@mui/material";
import useInfiniteScroll from "react-infinite-scroll-hook";

interface InfiniteScrollListProps {
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  error?: Error | string | null | undefined;
  children: React.ReactNode;
  isElementInTable?: boolean;
}

const InfiniteScrollList = ({
  hasMore,
  loadMore,
  isLoading,
  error,
  children,
  isElementInTable = false,
}: InfiniteScrollListProps) => {
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <>
      {children}
      {hasMore && !isLoading && (
        <Box
          component={isElementInTable ? "tr" : "div"}
          ref={sentryRef}
          height="20px"
        ></Box>
      )}
    </>
  );
};

export default InfiniteScrollList;
