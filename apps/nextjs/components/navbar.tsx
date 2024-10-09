"use client";
import { cn } from "@/lib/utils";
import io from 'socket.io-client';
import { onNavigate } from "@/actions/navigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import NavBarDropdown from "./shared/navbardropdown";
import { getAccessToken, getUserDetail } from "@/app/api/login-api/accessToken";
import Link from "next/link";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
// import { CornerDownRightIcon } from "lucide-react";
import { selectPatient } from "@/app/api/patients-api/patientSelect.api";
import SearchIconDynamic from "@/components/reusable/searchSvgColor";
import searchIcon from "@/public/icons/search-icon.svg";
import Notification from "./notification";
import { fetchNotifications } from "@/app/api/notifications-api/notifications.api";
interface Tabs {
  firstName: string;
  lastName: string;
  uuid: string;
}

interface UserDetail {
  fName?: string;
  lName?: string;
  uuid?: string;
  email?: string;
}

export const Navbar = (
  {
    // setIsLoading,
  }: {
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  },
) => {
  const router = useRouter();

  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [suggestionContainer, setSuggestionContainer] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tabs, setTabs] = useState<Tabs[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [id, setId] = useState(selectedPatientId);
  const [filteredPatient, setFilteredPatient] = useState<Tabs[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newNotificationLength, setNewNotificationLength] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationClicked,setIsNotificationClicked] = useState(0);
  const userDetail: UserDetail = getUserDetail();
  console.log(isNotificationClicked,"handleclickednotification")
  const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_URL!.replace('https', 'wss');
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const notifications = await fetchNotifications(
          userDetail.uuid!,
          router,
        );
        setNotifications(notifications);
        console.log(notifications, "notifications");
      } catch (error:any) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket','polling'],
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("notification", (newNotification) => {
      console.log("Notification received:", newNotification); // Log the received notification
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
      setNewNotificationLength((prevLength) => prevLength + 1);
    });

    fetchData();

    return () => {
      socket.disconnect();
    };
  }, [newNotificationLength,isNotificationClicked]);

  // const globalSearchRef = useRef<HTMLInputElement>(null);
  const [searchData, setSearchData] = useState([
    {
      firstName: "",
      lastName: "",
      uuid: "",
    },
  ]);
  const handleSearchChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setSearchValue(value);

    const searchTerms = value.trim().toLowerCase().split(/\s+/);
    console.log("searchterms", searchTerms);

    let filteredPatient: any = [];

    // search for firstname or full name
    if (searchTerms.length > 0) {
      filteredPatient = searchData.filter((patient) => {
        const firstNameTerm = searchTerms.slice(0, -1).join(" ");
        const lastNameTerm = searchTerms[searchTerms.length - 1];
        const fullNameTerm = searchTerms.join(" ");

        const firstName = patient.firstName.toLowerCase();
        const lastName = patient.lastName.toLowerCase();
        console.log(fullNameTerm, "combined first");
        console.log(firstName, "first");
        console.log(lastName, "lastName first");

        // Check if the combined search terms are present in the full name
        const result =
          (`${firstName}`.includes(firstNameTerm) &&
            `${lastName}`.includes(lastNameTerm)) ||
          `${firstName}`.includes(fullNameTerm) ||
          `${lastName}`.includes(fullNameTerm) ||
          `${firstName} ${lastName}` === fullNameTerm ||
          `${firstName}${lastName}` === fullNameTerm;

        console.log("result", result);
        return result;
      });
    } else {
      for (const word of searchTerms) {
        filteredPatient = searchData.filter((patient) => {
          const fullNameTerm = searchTerms.join(" ");

          const firstName = patient.firstName.toLowerCase();
          const lastName = patient.lastName.toLowerCase();
          console.log(fullNameTerm, "combined first");
          console.log(firstName, "first");
          console.log(lastName, "lastName first");

          // Check if the combined search terms are present in the full name
          const result =
            `${firstName}`.includes(word) || `${firstName}`.includes(word);

          console.log("result", result);
          return result;
        });
      }
    }
    // Stage 3: Check if the UUID includes the search term
    if (filteredPatient.length === 0) {
      filteredPatient = searchData.filter((patient) => {
        const uuid = patient.uuid.toLowerCase();

        return searchTerms.some((term: any) => uuid.includes(term));
      });
    }

    // If no matches, log "No result found"
    if (filteredPatient.length === 0) {
      console.log("No result found");
    }

    setFilteredPatient(filteredPatient);
  };

  const handleTabClick = (url: string, isActive: boolean) => {
    setIsActive(isActive);
    router.replace(url);
  };

  const routes = [
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Due Medications",
      url: "/due-medications",
    },
    {
      label: "Appointments",
      url: "/appointments",
    },
    {
      label: "Patients List",
      url: "/patient-list",
    },
    {
      label: "Chart",
      url: "/chart",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await selectPatient(router);
        setSearchData(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const onPatientClick = (patientId: string, url: string) => {
    setSelectedPatientId(patientId);
    const urlParts = url.split("/");
    const path = `/${urlParts[urlParts.length - 2]}/${
      urlParts[urlParts.length - 1]
    }`;
    router.push(`/patient-overview/${patientId.toLocaleLowerCase()}${path}`);
    setTimeout(() => {
      setShowGlobalSearch(false);
      setSuggestionContainer(false);
      setSelectedPatientId("");
    }, 300);
  };
  const tabsUrls = [
    {
      label: "MAR",
      subTab: [
        {
          label: "Scheduled",
          url: `/patient-overview/${selectedPatientId}/medication/scheduled`,
        },
        {
          label: "PRN",
          url: `/patient-overview/${selectedPatientId}/medication/prorenata`,
        },
      ],
    },
    {
      label: "Notes",
      subTab: [
        {
          label: "Nurse's Notes",
          url: `/patient-overview/${selectedPatientId}/notes/nurses-notes`,
        },
        {
          label: "Incident Report",
          url: `/patient-overview/${selectedPatientId}/notes/incident-report`,
        },
      ],
    },
    {
      label: "Vital Signs",
      url: `/patient-overview/${selectedPatientId}/vital-signs`,
    },
    {
      label: "Laboratory Results",
      url: `/patient-overview/${selectedPatientId}/lab-results`,
    },
    {
      label: "Medical History",
      subTab: [
        {
          label: "Surgeries",
          url: `/patient-overview/${selectedPatientId}/medical-history/surgeries`,
        },
        {
          label: "Allergies",
          url: `/patient-overview/${selectedPatientId}/medical-history/allergies`,
        },
      ],
    },
    {
      label: "Prescription",
      url: `/patient-overview/${selectedPatientId}/prescription`,
    },
    {
      label: "Forms",
      url: `/patient-overview/${selectedPatientId}/forms`,
      subTab: [
        {
          label: "Archived",
          url: `/patient-overview/${selectedPatientId}/forms/archived`,
        },
      ],
    },
    {
      label: "Appointment",
      url: `/patient-overview/${selectedPatientId}/patient-appointment`,
    },
  ];

  const [OpenProfile, setOpenProfile] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const notifIconRef = useRef<HTMLImageElement>(null);

  const handleMouseDownOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        console.log("Dropdown is being closed");
        setDropdownOpen(false);
      }
      if (
        isNotificationOpen &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node) &&
        !notifIconRef.current?.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    },
    [dropdownOpen, isNotificationOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDownOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [handleMouseDownOutside]);

  const handleMouseDownOutsideSearch = useCallback(
    (event: MouseEvent) => {
      if (
        showGlobalSearch &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        console.log("Dropdown is being closed");
        setIsAnimate(false);
        setSearchValue("");
        setTimeout(() => {
          setShowGlobalSearch(false);
          setSuggestionContainer(false);
        }, 300);
      }
    },
    [showGlobalSearch],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDownOutsideSearch);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutsideSearch);
    };
  }, [handleMouseDownOutsideSearch]);

  useEffect(() => {
    if (
      pathname === "/due-medications" ||
      pathname === "/patient-list" ||
      pathname === "/chart" ||
      pathname === "/appointments" ||
      pathname === "/dashboard"
    ) {
      // setIsLoading(false);
    }
  }, [pathname]);

  const handleSearchClick = () => {
    setShowGlobalSearch(true);
    setIsAnimate(true);
    // setIsFocused(true);
    // if (globalSearchRef.current) {
    //   globalSearchRef.current.focus();
    // }
  };

  return (
    <div className="fixed z-10 flex h-[70px] w-full items-center justify-between bg-[#007C85] px-[154px] text-[15px] font-medium">
      <Link href="/dashboard" shallow>
        <Image
          src={"/icons/colinahealth-logo.png"}
          alt={""}
          width={213}
          height={50}
          className="h-[26px] w-[213px] cursor-pointer"
          onClick={(event:any) => {
            if (pathname === "/dashboard") {
              event.preventDefault();
              // setIsLoading(true);
              window.location.reload();
            }
          }}
        />
      </Link>
      <div className="flex items-center gap-[30px]">
        <div className="flex items-end gap-[30px]">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.url}
              className={`relative cursor-pointer font-medium text-white`}
              onClick={() => {
                // setIsLoading(true);
                if (pathname === route.url) {
                  window.location.reload();
                }
              }}
            >
              <p className="hover:text-gray-200">{route.label}</p>
              {pathname === route.url && !showGlobalSearch && (
                <p
                  className={`${"absolute bottom-[-20px] w-full border-b-[2px] border-[#ffffff]"}`}
                ></p>
              )}
            </Link>
          ))}
        </div>
        <div
          className="relative -ml-3 -mr-3 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full hover:bg-[#D9D9D91A]"
          onClick={handleSearchClick}
          ref={searchRef}
        >
          <Image
            src="/icons/search-icon-white.svg"
            width={15}
            height={15}
            alt="search"
            className="absolute cursor-pointer"
          />
          {showGlobalSearch && (
            <>
              <div
                className={`global-search relative flex h-[40px] items-center rounded-sm bg-white shadow-md transition duration-300 ${isAnimate ? "animate" : "animate-close"}`}
              >
                {/* <Image
                  src={searchIcon}
                  width={14}
                  height={14}
                  alt="search"
                  className="absolute ml-3 cursor-pointer fill-white"
                /> */}

                <input
                  className="h-full w-full appearance-none rounded-sm pl-9 text-[15px] text-[#020817] outline-none"
                  placeholder="Search by Keyword"
                  value={searchValue}
                  autoFocus
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => handleSearchChange(e)}
                />
                <SearchIconDynamic
                  className={cn("fill-[#020817]")}
                  w={14}
                  h={14}
                />
              </div>
              {searchValue && (
                <div
                  className={`global-search w-full truncate rounded-sm bg-white p-[10px] shadow-md ${isAnimate ? "" : "animate-close"} ${
                    filteredPatient.length > 0
                      ? "top-[60px] h-[310px]"
                      : "top-[60px] h-[69px] flex items-center justify-center cursor-default"
                    // "bottom-[-200px] h-[60px] flex items-center justify-center"
                  }`}
                >
                  <>
                    {filteredPatient.length > 0 ? (
                      <div className="flex h-full w-full flex-col overflow-y-scroll">
                        {tabsUrls.map((tab, index) => (
                          <div key={index} className="flex flex-col gap-[8px]">
                            <p
                              className="mr-2 flex items-center justify-between bg-[#007C85] p-[10px] font-bold text-white"
                              key={index}
                            >
                              <span className="ml-1">{tab.label}</span>
                              {/* <span className="italic">TAB</span> */}
                            </p>
                            {!tab.url ? (
                              <>
                                {tab.subTab && (
                                  <>
                                    {tab.subTab.map((sub, subIndex) => (
                                      <div key={subIndex}>
                                        <div
                                          className="mr-2 flex items-center justify-between bg-[#007C85] p-[10px] font-bold text-white"
                                          key={index}
                                        >
                                          <div className="ml-2 flex gap-[10px]">
                                            <Image
                                              src="/icons/globalsearch-arrow.svg"
                                              alt="cornerarrowdown"
                                              width={18}
                                              height={10}
                                            />
                                            <p>{sub.label}</p>
                                          </div>
                                          {/* <p className="italic">SUBTAB</p> */}
                                        </div>

                                        {filteredPatient.map(
                                          (patient, index) => (
                                            <p
                                              onClick={() => {
                                                onPatientClick(
                                                  patient.uuid,
                                                  tab.subTab[0]?.url,
                                                );
                                              }}
                                              key={index}
                                              data-uuid={patient.uuid}
                                              className="flex cursor-pointer justify-between bg-white p-[10px] pl-[40px] hover:bg-[#D9D9D933]"
                                            >
                                              <span>
                                                {patient.firstName}{" "}
                                                {patient.lastName}
                                              </span>
                                              <span>{patient.uuid}</span>
                                            </p>
                                          ),
                                        )}
                                      </div>
                                    ))}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {filteredPatient.map((patient, index) => (
                                  <p
                                    onClick={() => {
                                      onPatientClick(patient.uuid, tab.url);
                                    }}
                                    key={index}
                                    data-uuid={patient.uuid}
                                    className="flex cursor-pointer justify-between bg-white p-[10px] hover:bg-[#D9D9D933]"
                                  >
                                    <span>
                                      {patient.lastName} {patient.firstName}
                                    </span>
                                    <span>{patient.uuid}</span>
                                  </p>
                                ))}

                                {tab.subTab && (
                                  <>
                                    {tab.url && (
                                      <>
                                        {tab.subTab.map((sub, subIndex) => (
                                          <div key={subIndex}>
                                            <div
                                              className="flex items-center justify-between bg-[#007C85] p-[10px] font-bold text-white"
                                              key={index}
                                            >
                                              <div className="flex gap-[10px]">
                                                <Image
                                                  src="/icons/globalsearch-arrow.svg"
                                                  alt="cornerarrowdown"
                                                  width={20}
                                                  height={20}
                                                />
                                                <p>{sub.label}</p>
                                              </div>

                                              <p className="italic">SUBTAB</p>
                                            </div>

                                            {filteredPatient.map(
                                              (patient, index) => (
                                                <p
                                                  onClick={() => {
                                                    onPatientClick(
                                                      patient.uuid,
                                                      tab.subTab[0]?.url,
                                                    );
                                                  }}
                                                  key={index}
                                                  data-uuid={patient.uuid}
                                                  className="flex cursor-pointer justify-between bg-white p-[10px] pl-[40px] hover:bg-[#D9D9D933]"
                                                >
                                                  <span>
                                                    {patient.lastName}{" "}
                                                    {patient.firstName}
                                                  </span>
                                                  <span>{patient.uuid}</span>
                                                </p>
                                              ),
                                            )}
                                          </div>
                                        ))}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                   
                        <div className="flex h-[69px] w-full flex-col items-center justify-center">
                          <p className="uppercase text-[#64748B]">
                            No Results Found
                          </p>
                        </div>
                     
                    )}
                  </>
                </div>
              )}
            </>
          )}
        </div>
        {/* Notification */}
        <div
          ref={notifIconRef}
          className={cn(
            "relative -ml-2 -mr-4 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full hover:bg-[#D9D9D91A]",
            { "bg-[#D9D9D91A]": isNotificationOpen },
          )}
          id="notification"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <Image
            src={"/icons/notification.svg"}
            alt={""}
            width={20}
            height={20}
            className=""
          />

          {notifications[0]?.userNotifications?.length === 0 && (
            <div className="absolute right-1 top-1 animate-ping rounded-full bg-red-500 p-1"></div>
          )}
          {notifications[0]?.userNotifications?.length === 0 && (
            <div className="absolute right-1 top-1 rounded-full bg-red-500 p-1"></div>
          )}
        </div>
        {isNotificationOpen && (
          <Notification
            ref={notifRef as React.RefObject<HTMLInputElement>}
            isNotificationOpen={isNotificationOpen}
            notifications={notifications}
            setIsNotificationOpen={setIsNotificationOpen}
            setIsNotificationClicked={setIsNotificationClicked}
            isNotificationClicked={isNotificationClicked}
          />
        )}
        <div className="flex items-center justify-end gap-3">
          <Image
            src={"/imgs/drake.png"}
            alt={""}
            width={30}
            height={30}
            className="rounded-full"
          />
          <Image
            ref={iconRef}
            className={`flex w-full cursor-pointer select-none justify-end ${
              dropdownOpen ? "rotate-180" : ""
            } h-auto w-auto duration-300`}
            onClick={() => {
              console.log("Toggling dropdownOpen state");
              setDropdownOpen((prevValue) => !prevValue);
            }}
            src={"/svgs/arrow-down.svg"}
            alt={""}
            width={15}
            height={15}
          />
          {dropdownOpen && (
            <NavBarDropdown
              ref={menuRef as React.RefObject<HTMLInputElement>}
              dropDownOpen={dropdownOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};
