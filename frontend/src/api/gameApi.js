import axios from "axios";

const API_Base = "http://localhost:8080/game";

export const startGame = async (players, ciMode = false) => {
  const response = await axios.post(`${API_Base}/start`, { players, ciMode });
  return response.data;
};

export const rollDice = async () => {
  const response = await axios.post(`${API_Base}/roll`);
  return response.data; // { message, game }
};

export const getGameState = async () => {
  const response = await axios.get(`${API_Base}/state`);
  return response.data;
};
