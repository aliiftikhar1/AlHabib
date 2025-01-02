"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { User, Plus, Minus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import Flights from "../Flights";

const FlightSearchBar  = async () => {
  const params = useParams();
  const [tripType, setTripType] = useState("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0 });
  const [showTravelersDialog, setShowTravelersDialog] = useState(false);
  const slug = await params.slug;
  console.log(slug);
  const locations = {
    from: ["Sialkot (SKT)", "Lahore (LHE)", "Karachi (KHI)", "Islamabad (ISB)", "Peshawar (PEW)"],
    to: ["Riyadh (RUH)", "Jeddah (JED)", "Dubai (DXB)", "Doha (DOH)", "Istanbul (IST)"],
  };

  const handleModify = () => {
    console.log({ tripType, from, to, departureDate, travelers });
  };

  const handleTravelerChange = (type, increment) => {
    setTravelers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

  const handleFromSelect = (location) => {
    setFrom(location);
    setShowFromDropdown(false);
  };

  const handleToSelect = (location) => {
    setTo(location);
    setShowToDropdown(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div>
      <Flights group={slug}/>
      </div>
    </div>
  );
};

export default FlightSearchBar;
