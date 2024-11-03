import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const UI = () => {
  const [service, setService] = useState("");
  const [northing, setNorthing] = useState("");
  const [easting, setEasting] = useState("");
  const [transformedX, setTransformedX] = useState("");
  const [transformedY, setTransformedY] = useState("");

  const ServiceChange = (event) => {
    setService(event.target.value);
  };

  const URL_WGStoLV = "http://geodesy.geo.admin.ch/reframe/wgs84tolv95";
  const URL_LVtoWGS = "http://geodesy.geo.admin.ch/reframe/lv95towgs84";
  const altitude = 550.0;

  async function Reframe() {
    const URL =
      service == "LVtoWGS"
        ? `${URL_LVtoWGS}?easting=${easting}&northing=${northing}&altitude=${altitude}&format=json`
        : `${URL_WGStoLV}?easting=${easting}&northing=${northing}&altitude=${altitude}&format=json`;

    try {
      const resp = await fetch(URL);
      if (resp.ok) {
        const data = await resp.json();
        setTransformedX(data.northing);
        setTransformedY(data.easting);
      } else {
        setTransformedX("Error");
        setTransformedY("Error");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <Box>
      {" "}
      <Typography variant="h3" gutterBottom>
        Coördinaattransformator
      </Typography>
      <Box>
        <FormControl fullWidth>
          <InputLabel id="service-select-label">Dienst</InputLabel>
          <Select
            labelId="service-select-label"
            id="service-select"
            value={service}
            label="REFRAME Service"
            onChange={ServiceChange}
          >
            <MenuItem value={"LVtoWGS"}>LV95 naar WGS84</MenuItem>
            <MenuItem value={"WGStoLV"}>WGS84 naar LV95</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <TextField
          id="northing"
          label="Noorden"
          variant="outlined"
          value={northing}
          onChange={(e) => setNorthing(e.target.value)}
          sx={{ width: "200px" }}
        />
        <TextField
          id="easting"
          label="Oostelijk"
          variant="outlined"
          value={easting}
          onChange={(e) => setEasting(e.target.value)}
          sx={{ width: "200px" }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={Reframe}
        sx={{ mb: 2, width: "400px" }}
      >
        TRANSFORMEREN
      </Button>
      <Box>
        <TextField
          id="transformed-x"
          label="Getransformeerde X"
          variant="outlined"
          value={transformedX}
          sx={{ width: "200px" }}
        />
        <TextField
          id="transformed-y"
          label="Getransformeerde Y"
          variant="outlined"
          value={transformedY}
          sx={{ width: "200px" }}
        />
      </Box>
    </Box>
  );
};

export default UI;
