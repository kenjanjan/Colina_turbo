import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { TextareaHTMLAttributes, useState } from "react";

const referenceMockData = [
  {
    id: 1,
    name: "ORDER UID-123123123122",
  },
  {
    id: 2,
    name: "ORDER UID-123332113333",
  },
  {
    id: 3,
    name: "ORDER UID-123321321334",
  },
  {
    id: 4,
    name: "ORDER UID-123456789012",
  },
  {
    id: 5,
    name: "ORDER UID-123654987321",
  },
  {
    id: 6,
    name: "ORDER UID-123987654321",
  },
  {
    id: 7,
    name: "ORDER UID-987654321234",
  },
  {
    id: 8,
    name: "ORDER UID-654123789654",
  },
  {
    id: 9,
    name: "ORDER UID-321987654321",
  },
  {
    id: 10,
    name: "ORDER UID-654987123654",
  },
  {
    id: 11,
    name: "ORDER UID-987123456789",
  },
  {
    id: 12,
    name: "ORDER UID-123789456123",
  },
  {
    id: 13,
    name: "ORDER UID-456123789456",
  },
  {
    id: 14,
    name: "ORDER UID-789654123987",
  },
  {
    id: 15,
    name: "ORDER UID-321654987321",
  },
  {
    id: 16,
    name: "ORDER UID-456987123654",
  },
  {
    id: 17,
    name: "ORDER UID-789123654987",
  },
  {
    id: 18,
    name: "ORDER UID-123456789987",
  },
  {
    id: 19,
    name: "ORDER UID-654321987456",
  },
  {
    id: 20,
    name: "ORDER UID-987456321654",
  },
];

const DietaryOrderCategory = ({ data, tab }: { data?: any; tab?: string }) => {
  const [isReferenceUIDChecked, setIsReferenceUIDChecked] = useState(false);
  const [term, setTerm] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const handleReferenceUIDCheckbox = () => {
    setIsReferenceUIDChecked(!isReferenceUIDChecked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const handleReferenceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setIsReferenceOpen(true);
  };

  console.log(data, "data");
  return (
    <div className="flex flex-col gap-3">
      {!tab && (
        <div className="flex gap-1.5">
          <input
            id="checkbox"
            type="checkbox"
            onChange={handleReferenceUIDCheckbox}
            className="cursor-pointer"
          />
          <label htmlFor="checkbox" className="sub-title cursor-pointer">
            is this add reference UID?
          </label>
        </div>
      )}
      {isReferenceUIDChecked && (
        <div className="flex flex-col">
          <input
            required
            type="text"
            value={term}
            onChange={handleReferenceSearch}
            placeholder="example: ORDER UID-123123123123"
            className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
          {term && isReferenceOpen && (
            <div className="relative z-50">
              <div className="absolute mt-2 max-h-[200px] w-full overflow-y-auto rounded-lg bg-white px-4 py-2 drop-shadow-lg">
                <p className="sub-title !font-semibold">Select</p>
                {referenceMockData.filter((mock) =>
                  mock.name.toLowerCase().includes(term.toLowerCase()),
                ).length > 0 ? (
                  referenceMockData
                    .filter((mock) =>
                      mock.name.toLowerCase().includes(term.toLowerCase()),
                    )
                    .map((mock, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setTerm(mock.name);
                          setIsReferenceOpen(false);
                        }}
                        className="cursor-pointer space-x-2 font-semibold hover:text-[#03595B]"
                      >
                        <p>{mock.name}</p>
                      </div>
                    ))
                ) : (
                  <p>No result found</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex w-full justify-between gap-5">
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">
            Dietary Requirement
          </h1>
          <input
            required
            type="text"
            value={data?.dietary_requirement}
            placeholder="input dietary requirement"
            className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">Status</h1>
          <div className="relative">
            <select
              required
              value={data?.status}
              className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Image
              className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
              width={20}
              height={20}
              src={"/svgs/chevron-up.svg"}
              alt={""}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="required-field text-[20px] font-medium">Status</h1>
        <textarea
          required
          value={data?.notes}
          placeholder="input notes"
          maxLength={200}
          onChange={handleInputChange}
          className="block h-[96px] w-full resize-none rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
        />
        <p
          className={cn("sub-title text-end", {
            "!text-red-500": charCount === 200,
          })}
        >
          {charCount}/200 Characters
        </p>
      </div>
    </div>
  );
};

export default DietaryOrderCategory;
