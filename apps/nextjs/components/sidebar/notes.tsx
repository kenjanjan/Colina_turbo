import React from "react";
import { DateTime } from "luxon";
import ResuableTooltip from "../reusable/tooltip";
import NotesLoader from "./loaders/notesLoader";
interface NotesProps {
  latestNotes: any;
  latestIncidentReport: any;
  isLoading: boolean;
}
const formatDateTime = (dateTimeString: string) => {
  const dateTime = DateTime.fromISO(dateTimeString).setZone("local");
  if (!dateTime.isValid) {
    return "Invalid date";
  }
  return dateTime.toFormat("dd / MM / yyyy : hh:mm a");
};
const Notes = ({ latestNotes, latestIncidentReport, isLoading }: NotesProps) => {
  return (
    <>
      <div className="sidebar-divider" />
      {isLoading ? (
        <NotesLoader />
      ) : (
        <div>
          {latestNotes.notes_notes != null ? (
            <div>
              <h1 className="mb-1 font-semibold text-[#4FF4FF]">
                Nurse's Note{" "}
                <span className="text-[#FCFF9D]">
                  <span className="text-white">-</span>{" "}
                  {formatDateTime(latestNotes.notes_createdAt)}
                  
                </span>
              </h1>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Subject:</div>
                <div className="truncate">
                  <ResuableTooltip text={`${latestNotes.notes_subject}`} />
                </div>
              </div>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Notes:</div>
                <div className="truncate">
                  <ResuableTooltip text={`${latestNotes.notes_notes}`} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="mb-1 font-semibold text-[#4FF4FF]">
                Nurse's Note{" "}
              </h1>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Subject:</div>
                <div className="truncate">N/A</div>
              </div>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Notes:</div>
                <div className="truncate">N/A</div>
              </div>
            </div>
          )}
          <div className="sidebar-divider" />
          {latestIncidentReport.notes_notes != null ? (
            <div>
              <h1 className="mb-1 font-semibold text-[#4FF4FF]">
                Incident Report
                <span className="text-[#FCFF9D]">
                  <span className="text-white"> -</span>{" "}
                  {formatDateTime(latestIncidentReport.notes_createdAt)}
                </span>
              </h1>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Subject:</div>
                <div className="truncate">
                  <ResuableTooltip
                    text={`${latestIncidentReport.notes_subject}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Details:</div>
                <div className="truncate">
                  <ResuableTooltip
                    text={`${latestIncidentReport.notes_notes}`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="mb-1 font-semibold text-[#4FF4FF]">
                Incident Report
              </h1>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Subject:</div>
                <div className="truncate">N/A</div>
              </div>
              <div className="grid grid-cols-[0.5fr_1fr]">
                <div>Details:</div>
                <div className="truncate">N/A</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notes;
