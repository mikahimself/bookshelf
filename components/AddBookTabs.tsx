import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Button from "./ui/Button";
import { ActiveTab } from "./AddBookModal";

type AddBookTabsProps = {
  activeTab: ActiveTab;
  previousTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

export default function AddBookTabs({
  activeTab,
  previousTab,
  setActiveTab,
}: AddBookTabsProps) {
  return (
    <div className="flex flex-row border-b border-gray-300">
      {activeTab !== "RESULTS" && (
        <>
          <div
            role="button"
            className={`${activeTab === "SCAN" ? "border-b-3 border-b-blue-500 font-semibold" : ""} flex-1 cursor-pointer rounded-t-sm p-1 pt-3 text-center hover:bg-gray-200 active:bg-gray-300`}
            onClick={() => setActiveTab("SCAN")}
          >
            Lue viivakoodi
          </div>
          <div
            role="button"
            className={`${activeTab === "ENTER" ? "border-b-3 border-b-blue-500 font-semibold" : ""} flex-1 cursor-pointer rounded-t-sm p-1 pt-3 text-center hover:bg-gray-200 active:bg-gray-300`}
            onClick={() => setActiveTab("ENTER")}
          >
            Syötä
          </div>
        </>
      )}
      {activeTab === "RESULTS" && (
        <div className="pb-1 pl-2">
          <Button
            icon={ArrowLeftIcon}
            onClick={() => setActiveTab(previousTab)}
          >
            Takaisin hakuun
          </Button>
        </div>
      )}
    </div>
  );
}
