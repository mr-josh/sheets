import { createEmotionCache, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLoader from "./components/page-loader";

const MainPage = lazy(() => import("./pages/main"));
const ManagerPage = lazy(() => import("./pages/manager"));

function App() {
  return (
    <MantineProvider
      theme={{ primaryColor: "pink" }}
      emotionCache={createEmotionCache({ key: "mantine", prepend: false })}
    >
      <Notifications position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <MainPage />
              </Suspense>
            }
          />
          <Route
            path="/manager"
            element={
              <Suspense fallback={<PageLoader />}>
                <ManagerPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
