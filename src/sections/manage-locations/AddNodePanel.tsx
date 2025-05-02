import { Drawer, Stack } from "@mui/material";
import { PanelTitle } from "../settings/AddNewShift";
import AutoCompleteSingle from "../../components/design-system/AutoCompleteSingle";
import { PanelTextField } from "../../components/design-system/PanelTextField";
import { timezoneOptions } from "../../utils/constants";
import PopupButton from "../../components/design-system/PopupButton";
import { useState } from "react";

interface props {
  open: boolean;
  onClose: () => void;
  onClick: (location: string, timezone: string) => void;
}

const AddNodePanel = ({ open, onClose, onClick }: props) => {
  const [locationName, setLocationName] = useState("");
  const [timezone, setTimezone] = useState(timezoneOptions[0].value);

  const closePanel = () => {
    onClose();
    setLocationName("");
    setTimezone(timezoneOptions[0].value);
  };
  return (
    <Drawer anchor="right" open={open} onClose={closePanel}>
      <PanelTitle title="Add New Location" onClose={closePanel} />
      <Stack gap={2} sx={{ m: 2 }}>
        <PanelTextField
          sx={{ width: "100%" }}
          placeholder="Location Name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <AutoCompleteSingle
          options={timezoneOptions}
          selectedOption={timezone}
          onChange={(va) => setTimezone(va?.value || "")}
          placeholder="Search Timezone"
        />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 2 }}
      >
        <PopupButton onClick={() => onClick(locationName, timezone)} data-testid="location-popup-save">
          Save
        </PopupButton>
        <PopupButton onClick={closePanel} data-testid="location-popup-cancel">Cancel</PopupButton>
      </Stack>
    </Drawer>
  );
};

export default AddNodePanel;
