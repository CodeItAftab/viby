import { Input } from "@/components/ui/input";
import { memo } from "react";

function SearchInput() {
  return (
    <section className="flex items-center justify-center w-full lg:p-0 px-4 shrink-0 lg:mb-0 mb-2">
      <Input
        type="text"
        placeholder="Search chats"
        className="lg:bg-white lg:text-base text-sm bg-slate-50 lg:w-[330px] w-full focus-visible:ring-[#1976d4] shadow-none border-none font-normal"
      />
    </section>
  );
}

export default memo(SearchInput);
