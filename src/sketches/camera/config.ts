export default {
  defaultTitle: "Camera",
  params: [
    {
      key: "rotSpeed",
      defaultValue: 0,
      sliderMax: 0.2,
    },
    {
      key: "lookAtPosY",
      defaultValue: 0,
      sliderMax: 10,
    },
    {
      key: "camY",
      defaultValue: 0,
      sliderMax: 10,
    },
    {
      key: "orbitRad",
      defaultValue: 1,
      sliderMax: 20,
    },
    {
      key: "bigZoom",
      defaultValue: 1,
      sliderMax: 100,
    },
    {
      key: "headCamDistance",
      defaultValue: 0,
      sliderMax: 20,
    },
    {
      key: "mode",
      title: "Camera Mode",
      valueType: "enum",
      defaultValue: "orbit",
      options: [
        {
          label: "Orbit",
          value: "orbit",
        },
        {
          label: "Close Up",
          value: "closeUp",
        },
      ],
    },
  ],
};
