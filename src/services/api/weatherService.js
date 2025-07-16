import weatherData from "../mockData/weather.json";

let weather = [...weatherData];

const weatherService = {
  async getForecast() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...weather]);
      }, 400);
    });
  },

  async getToday() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split("T")[0];
        const todayWeather = weather.find(w => w.date.startsWith(today));
        resolve(todayWeather || weather[0]);
      }, 200);
    });
  }
};

export default weatherService;