import { Suspense, ComponentType } from "react";
import LoadingOverlay from "./design-system/LoadingOverlay";

const WithSuspenseLoad =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) =>
    (
      <Suspense fallback={<LoadingOverlay isLoading />}>
        <Component {...props} />
      </Suspense>
    );

export default WithSuspenseLoad;
