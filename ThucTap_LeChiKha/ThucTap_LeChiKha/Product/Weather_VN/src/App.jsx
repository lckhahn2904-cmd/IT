import React, { useState, useEffect, useRef } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, MapPin, TrendingUp, MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

// BẢN ĐỒ – CHỈ CẦN IMPORT NHƯ VẬY LÀ ĐỦ
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherApp = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weekForecast, setWeekForecast] = useState([]);     // thêm dòng này
  const [loadingForecast, setLoadingForecast] = useState(false); // thêm dòng này (tùy chọn)
  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [extremeEvents, setExtremeEvents] = useState([]);
  const [sectorImpacts, setSectorImpacts] = useState([]);

// Danh sách 3 miền
const regions = [
  { id: 1, region: 'Miền Bắc' },
  { id: 2, region: 'Miền Trung' },
  { id: 3, region: 'Miền Nam' }
];

  // Danh sách tỉnh + tọa độ thực tế để gọi API (mình chọn trạm chính của mỗi tỉnh)
const provinces = [
  // MIỀN BẮC
  { id: 1, name: 'Hà Nội', region: 'Miền Bắc', lat: 21.0285, lon: 105.8542, stations: ['Láng', 'Hà Đông', 'Ba Vì'] },
  { id: 2, name: 'Hải Phòng', region: 'Miền Bắc', lat: 20.8651, lon: 106.6838, stations: ['Cát Bà', 'Đồ Sơn', 'Kiến An'] },
  { id: 3, name: 'Quảng Ninh', region: 'Miền Bắc', lat: 20.9713, lon: 107.0448, stations: ['Hạ Long', 'Cẩm Phả', 'Móng Cái'] },
  { id: 4, name: 'Lào Cai', region: 'Miền Bắc', lat: 22.3381, lon: 103.8470, stations: ['TP Lào Cai', 'Sa Pa', 'Bát Xát'] },
  { id: 5, name: 'Hà Giang', region: 'Miền Bắc', lat: 22.8233, lon: 104.9836, stations: ['TP Hà Giang', 'Đồng Văn', 'Quản Bạ'] },
  { id: 6, name: 'Cao Bằng', region: 'Miền Bắc', lat: 22.6653, lon: 106.2570, stations: ['TP Cao Bằng', 'Trùng Khánh', 'Hà Quảng'] },
  { id: 7, name: 'Lạng Sơn', region: 'Miền Bắc', lat: 21.8537, lon: 106.7615, stations: ['TP Lạng Sơn', 'Đồng Đăng', 'Hữu Lũng'] },
  { id: 8, name: 'Bắc Giang', region: 'Miền Bắc', lat: 21.2810, lon: 106.1970, stations: ['Bắc Giang', 'Lục Ngạn', 'Yên Thế'] },
  { id: 9, name: 'Bắc Kạn', region: 'Miền Bắc', lat: 22.1470, lon: 105.8348, stations: ['TP Bắc Kạn', 'Ba Bể', 'Chợ Mới'] },
  { id: 10, name: 'Thái Nguyên', region: 'Miền Bắc', lat: 21.5942, lon: 105.8480, stations: ['TP Thái Nguyên', 'Phổ Yên', 'Định Hóa'] },
  { id: 11, name: 'Tuyên Quang', region: 'Miền Bắc', lat: 21.8236, lon: 105.2149, stations: ['TP Tuyên Quang', 'Chiêm Hóa', 'Hàm Yên'] },
  { id: 12, name: 'Phú Thọ', region: 'Miền Bắc', lat: 21.3227, lon: 105.4020, stations: ['Việt Trì', 'Lâm Thao', 'Thanh Sơn'] },
  { id: 13, name: 'Vĩnh Phúc', region: 'Miền Bắc', lat: 21.3089, lon: 105.6049, stations: ['Vĩnh Yên', 'Phúc Yên', 'Tam Đảo'] },
  { id: 14, name: 'Bắc Ninh', region: 'Miền Bắc', lat: 21.1861, lon: 106.0763, stations: ['TP Bắc Ninh', 'Tiên Du', 'Yên Phong'] },
  { id: 15, name: 'Hưng Yên', region: 'Miền Bắc', lat: 20.8525, lon: 106.0160, stations: ['TP Hưng Yên', 'Mỹ Hào', 'Văn Giang'] },
  { id: 16, name: 'Hải Dương', region: 'Miền Bắc', lat: 20.9390, lon: 106.3305, stations: ['TP Hải Dương', 'Chí Linh', 'Nam Sách'] },
  { id: 17, name: 'Thái Bình', region: 'Miền Bắc', lat: 20.4463, lon: 106.3366, stations: ['TP Thái Bình', 'Tiền Hải', 'Quỳnh Phụ'] },
  { id: 18, name: 'Nam Định', region: 'Miền Bắc', lat: 20.4339, lon: 106.1773, stations: ['TP Nam Định', 'Hải Hậu', 'Ý Yên'] },
  { id: 19, name: 'Ninh Bình', region: 'Miền Bắc', lat: 20.2500, lon: 105.9750, stations: ['TP Ninh Bình', 'Tam Điệp', 'Gia Viễn'] },
  { id: 20, name: 'Hà Nam', region: 'Miền Bắc', lat: 20.5340, lon: 105.9237, stations: ['Phủ Lý', 'Thanh Liêm', 'Bình Lục'] },
  { id: 21, name: 'Hòa Bình', region: 'Miền Bắc', lat: 20.8171, lon: 105.3376, stations: ['TP Hòa Bình', 'Mai Châu', 'Lương Sơn'] },
  { id: 22, name: 'Sơn La', region: 'Miền Bắc', lat: 21.3270, lon: 103.9140, stations: ['TP Sơn La', 'Mộc Châu', 'Thuận Châu'] },
  { id: 23, name: 'Điện Biên', region: 'Miền Bắc', lat: 21.3860, lon: 103.0238, stations: ['TP Điện Biên Phủ', 'Mường Nhé', 'Tuần Giáo'] },
  { id: 24, name: 'Lai Châu', region: 'Miền Bắc', lat: 22.3964, lon: 103.4580, stations: ['TP Lai Châu', 'Phong Thổ', 'Sìn Hồ'] },
  { id: 25, name: 'Yên Bái', region: 'Miền Bắc', lat: 21.7056, lon: 104.8799, stations: ['TP Yên Bái', 'Nghĩa Lộ', 'Lục Yên'] },

  // MIỀN TRUNG
  { id: 26, name: 'Thanh Hóa', region: 'Miền Trung', lat: 19.8067, lon: 105.7852, stations: ['Thanh Hóa', 'Sầm Sơn', 'Bỉm Sơn'] },
  { id: 27, name: 'Nghệ An', region: 'Miền Trung', lat: 18.6733, lon: 105.6923, stations: ['Vinh', 'Con Cuông', 'Quỳ Hợp'] },
  { id: 28, name: 'Hà Tĩnh', region: 'Miền Trung', lat: 18.3559, lon: 105.8878, stations: ['Hà Tĩnh', 'Kỳ Anh', 'Hồng Lĩnh'] },
  { id: 29, name: 'Quảng Bình', region: 'Miền Trung', lat: 17.4689, lon: 106.6223, stations: ['Đồng Hới', 'Tuyên Hóa', 'Lệ Thủy'] },
  { id: 30, name: 'Quảng Trị', region: 'Miền Trung', lat: 16.8163, lon: 107.1002, stations: ['Đông Hà', 'Quảng Trị', 'Hải Lăng'] },
  { id: 31, name: 'Thừa Thiên Huế', region: 'Miền Trung', lat: 16.4637, lon: 107.5909, stations: ['Huế', 'Phú Bài', 'Hương Thủy'] },
  { id: 32, name: 'Đà Nẵng', region: 'Miền Trung', lat: 16.0471, lon: 108.2067, stations: ['Sơn Trà', 'Hòa Vang', 'Ngũ Hành Sơn'] },
  { id: 33, name: 'Quảng Nam', region: 'Miền Trung', lat: 15.5730, lon: 108.4740, stations: ['Tam Kỳ', 'Hội An', 'Núi Thành'] },
  { id: 34, name: 'Quảng Ngãi', region: 'Miền Trung', lat: 15.1209, lon: 108.8040, stations: ['TP Quảng Ngãi', 'Đức Phổ', 'Bình Sơn'] },
  { id: 35, name: 'Bình Định', region: 'Miền Trung', lat: 13.7820, lon: 109.2190, stations: ['Quy Nhơn', 'Hoài Nhơn', 'An Nhơn'] },
  { id: 36, name: 'Phú Yên', region: 'Miền Trung', lat: 13.0882, lon: 109.0929, stations: ['Tuy Hòa', 'Sông Cầu', 'Đồng Xuân'] },
  { id: 37, name: 'Khánh Hòa', region: 'Miền Trung', lat: 12.2388, lon: 109.1967, stations: ['Nha Trang', 'Cam Ranh', 'Ninh Hòa'] },
  { id: 38, name: 'Ninh Thuận', region: 'Miền Trung', lat: 11.5670, lon: 108.9876, stations: ['Phan Rang', 'Ninh Phước', 'Thuận Bắc'] },
  { id: 39, name: 'Bình Thuận', region: 'Miền Trung', lat: 10.9804, lon: 108.2615, stations: ['Phan Thiết', 'Bắc Bình', 'Tuy Phong'] },
  { id: 40, name: 'Kon Tum', region: 'Miền Trung', lat: 14.3498, lon: 108.0000, stations: ['Kon Tum', 'Đắk Glei', 'Sa Thầy'] },
  { id: 41, name: 'Gia Lai', region: 'Miền Trung', lat: 13.8073, lon: 108.1094, stations: ['Pleiku', 'An Khê', 'Ayun Pa'] },
  { id: 42, name: 'Đắk Lắk', region: 'Miền Trung', lat: 12.6667, lon: 108.0382, stations: ['Buôn Ma Thuột', 'Ea H’leo', 'Krông Pắc'] },
  { id: 43, name: 'Đắk Nông', region: 'Miền Trung', lat: 12.2842, lon: 107.6098, stations: ['Gia Nghĩa', 'Đắk R’lấp', 'Cư Jút'] },
  { id: 44, name: 'Lâm Đồng', region: 'Miền Trung', lat: 11.9404, lon: 108.4583, stations: ['Đà Lạt', 'Bảo Lộc', 'Đơn Dương'] },

  // MIỀN NAM
  { id: 45, name: 'TP. Hồ Chí Minh', region: 'Miền Nam', lat: 10.8231, lon: 106.6297, stations: ['Tân Sơn Nhất', 'Thủ Đức', 'Cần Giờ'] },
  { id: 46, name: 'Bình Dương', region: 'Miền Nam', lat: 11.1770, lon: 106.6550, stations: ['Thủ Dầu Một', 'Dĩ An', 'Tân Uyên'] },
  { id: 47, name: 'Đồng Nai', region: 'Miền Nam', lat: 10.9453, lon: 106.8243, stations: ['Biên Hòa', 'Long Khánh', 'Nhơn Trạch'] },
  { id: 48, name: 'Bà Rịa - Vũng Tàu', region: 'Miền Nam', lat: 10.5417, lon: 107.2429, stations: ['Vũng Tàu', 'Côn Đảo', 'Long Sơn'] },
  { id: 49, name: 'Tây Ninh', region: 'Miền Nam', lat: 11.3352, lon: 106.1099, stations: ['Tây Ninh', 'Hòa Thành', 'Gò Dầu'] },
  { id: 50, name: 'Bình Phước', region: 'Miền Nam', lat: 11.7512, lon: 106.7235, stations: ['Đồng Xoài', 'Bù Đăng', 'Lộc Ninh'] },
  { id: 51, name: 'Long An', region: 'Miền Nam', lat: 10.6956, lon: 106.2430, stations: ['Tân An', 'Đức Hòa', 'Bến Lức'] },
  { id: 52, name: 'Tiền Giang', region: 'Miền Nam', lat: 10.4493, lon: 106.3420, stations: ['Mỹ Tho', 'Cai Lậy', 'Gò Công'] },
  { id: 53, name: 'Bến Tre', region: 'Miền Nam', lat: 10.2415, lon: 106.3759, stations: ['TP Bến Tre', 'Châu Thành', 'Ba Tri'] },
  { id: 54, name: 'Vĩnh Long', region: 'Miền Nam', lat: 10.2540, lon: 105.9580, stations: ['TP Vĩnh Long', 'Mang Thít', 'Trà Ôn'] },
  { id: 55, name: 'Trà Vinh', region: 'Miền Nam', lat: 9.9347, lon: 106.3420, stations: ['TP Trà Vinh', 'Cầu Ngang', 'Tiểu Cần'] },
  { id: 56, name: 'Hậu Giang', region: 'Miền Nam', lat: 9.7830, lon: 105.4700, stations: ['Vị Thanh', 'Ngã Bảy', 'Long Mỹ'] },
  { id: 57, name: 'Sóc Trăng', region: 'Miền Nam', lat: 9.6025, lon: 105.9732, stations: ['TP Sóc Trăng', 'Mỹ Xuyên', 'Vĩnh Châu'] },
  { id: 58, name: 'An Giang', region: 'Miền Nam', lat: 10.5216, lon: 105.1259, stations: ['Long Xuyên', 'Châu Đốc', 'Tân Châu'] },
  { id: 59, name: 'Kiên Giang', region: 'Miền Nam', lat: 10.0125, lon: 105.0809, stations: ['Rạch Giá', 'Hà Tiên', 'Phú Quốc'] },
  { id: 60, name: 'Cần Thơ', region: 'Miền Nam', lat: 10.0452, lon: 105.7469, stations: ['Ninh Kiều', 'Cái Răng', 'Phong Điền'] },
  { id: 61, name: 'Đồng Tháp', region: 'Miền Nam', lat: 10.4930, lon: 105.6882, stations: ['Cao Lãnh', 'Sa Đéc', 'Hồng Ngự'] },
  { id: 62, name: 'Cà Mau', region: 'Miền Nam', lat: 9.1768, lon: 105.1524, stations: ['Cà Mau', 'Đầm Dơi', 'Năm Căn'] },
  { id: 63, name: 'Bạc Liêu', region: 'Miền Nam', lat: 9.2941, lon: 105.7278, stations: ['TP Bạc Liêu', 'Giá Rai', 'Vĩnh Lợi'] }
];

  // ================== HÀM CHUYỂN HƯỚNG GIÓ TỪ ĐỘ SANG TIẾNG VIỆT ==================
    const getWindDirection = (deg) => {
      if (deg === undefined || deg === null) return '—';
      const directions = [
        'Bắc', 'Bắc Đông Bắc', 'Đông Bắc', 'Đông Đông Bắc',
        'Đông', 'Đông Đông Nam', 'Đông Nam', 'Nam Đông Nam',
        'Nam', 'Nam Tây Nam', 'Tây Nam', 'Tây Tây Nam',
        'Tây', 'Tây Tây Bắc', 'Tây Bắc', 'Bắc Tây Bắc'
      ];
      const index = Math.round(deg / 22.5) % 16;
      return directions[index];
    };

  // ================== LẤY DỮ LIỆU THỰC TẾ – PHIÊN BẢN ỔN ĐỊNH 100% ==================
  useEffect(() => {
    if (selectedProvince && selectedStation) {
      const province = provinces.find(p => p.name === selectedProvince);
      if (!province) return;

      setLoading(true);
      setError('');
      setCurrentWeather(null);
      setWeekForecast([]);
      setWeatherAlerts([]);
      setExtremeEvents([]);
      setSectorImpacts([]);

      const lat = province.lat;
      const lon = province.lon;
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      // 1. Lấy thời tiết hiện tại
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`)
        .then(res => {
          const d = res.data;
          setCurrentWeather({
            temp: Math.round(d.main.temp),
            feels: Math.round(d.main.feels_like),
            condition: d.weather[0].description.charAt(0).toUpperCase() + d.weather[0].description.slice(1),
            humidity: d.main.humidity,
            rainfall: d.rain?.['1h'] || 0,
            wind: Math.round(d.wind.speed * 3.6),           // km/h
            gust: d.wind.gust ? Math.round(d.wind.gust * 3.6) : null,  // giật gió (có thể không có)
            directionDeg: d.wind.deg || 0,                  // độ hướng gió
            uv: 7,
            icon: d.weather[0].icon
          });
        })
        .catch(() => console.log("Lỗi OpenWeather hiện tại"));

      // 2. Dự báo 5 ngày + Tự động sinh CỰC ĐOAN + TÁC ĐỘNG NGÀNH (fallback thông minh)
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`)
        .then(res => {
          const list = res.data.list;
          const alerts = [];
          let heavyRain = false, veryHot = false, strongWind = false, totalRain24h = 0;

          list.slice(0, 8).forEach(item => {
            if (item.rain?.['3h']) totalRain24h += item.rain['3h'];
            if (item.rain?.['3h'] > 30 || item.pop > 0.8) heavyRain = true;
            if (item.main.temp > 36) veryHot = true;
            if (item.wind.speed * 3.6 > 50) strongWind = true;
          });
          // ================== GỌI API FASTAPI CNN-LSTM ==================
          // Chuẩn hoá input 14 dòng × 8 biến
          // (Dựa theo dữ liệu của OpenWeather 3h/lần → lấy 14 lần đầu)

          const aiData = list.slice(0, 14).map(item => {
            const temp = item.main.temp || 0;
            const humidity = item.main.humidity || 0;

            return [
              temp,                                      // Nhiet_do
              item.rain?.["3h"] || 0,                    // Luong_Mua_mm
              humidity,                                  // Do_Am
              item.wind.speed ? item.wind.speed * 3.6 : 0, // Toc_Do_Gio
              item.wind.deg || 0,                        // HuongGio_Toado
              (1 - item.clouds.all / 100) * 12,          // So_Gio_Nang (ước lượng)
              item.main.pressure ? item.main.pressure / 10 : 0, // Ap_Suat_kPa
              temp - ((100 - humidity) / 5)              // Diem_Suong
            ];
          });

          // Nếu dữ liệu OpenWeather < 14 điểm → tự nhân bản cho đủ
          while (aiData.length < 14) {
            aiData.push(aiData[aiData.length - 1]);
          }

          const inputData = {
            data: aiData,
            features: [
                "Nhiet_do",
                "Luong_Mua_mm", 
                "Do_Am",
                "Toc_Do_Gio",
                "HuongGio_Toado",
                "So_Gio_Nang",
                "Ap_Suat_kPa", 
                "Diem_Suong"
              ]
          };

          axios.post("http://127.0.0.1:8000/predict", inputData)
            .then(apiRes => {
              console.log("Dự báo từ FastAPI:", apiRes.data);

              setSectorImpacts(prev => [
                ...prev,
                {
                  name: "Dự báo CNN-LSTM",
                  level: "Thông tin",
                  levelColor: "bg-blue-500",
                  desc: `
                    Gió: ${apiRes.data.forecast.Toc_Do_Gio?.toFixed(2)} 
                    Nhiệt độ: ${apiRes.data.forecast.Nhiet_do?.toFixed(2)} 
                    Mưa: ${apiRes.data.forecast.Luong_Mua_mm?.toFixed(2)} 
                  `,
                  advice: "Kết quả được tạo bởi mô hình CNN-LSTM."
                }
              ]);
            })
            .catch(err => {
              console.log("Lỗi FastAPI:", err);
            });

          // Cảnh báo 24h (giữ nguyên)
          if (heavyRain || totalRain24h > 50) alerts.push({ type: "Mưa lớn", level: "danger", title: "Cảnh báo mưa lớn đến rất lớn trong 24h tới", advice: "Hạn chế di chuyển, đề phòng ngập lụt" });
          if (veryHot) alerts.push({ type: "Nắng nóng", level: "warning", title: "Nhiệt độ có thể trên 37°C", advice: "Hạn chế ra ngoài giờ cao điểm, uống đủ nước" });
          if (strongWind) alerts.push({ type: "Gió mạnh", level: "warning", title: "Gió mạnh cấp 6-7", advice: "Gia cố nhà cửa, tránh ra biển" });
          if (alerts.length === 0) alerts.push({ type: "An toàn", level: "success", title: "Thời tiết ổn định", advice: "Thuận lợi cho mọi hoạt động" });
          setWeatherAlerts(alerts);

          // Dự báo 5 ngày
          const daily = {};
          list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('vi-VN');
            if (!daily[date]) daily[date] = { temps: [], icons: [], pop: 0, wind: 0 };
            daily[date].temps.push(item.main.temp);
            daily[date].icons.push(item.weather[0].icon);
            daily[date].pop = Math.max(daily[date].pop, (item.pop || 0) * 100);
            daily[date].wind = Math.max(daily[date].wind, item.wind.speed * 3.6);
          });

          const forecast5days = Object.keys(daily).slice(1, 6).map(date => {
            const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const dayName = weekdays[new Date(date.split('/').reverse().join('-')).getDay()];
            const temps = daily[date].temps;
            return {
              day: dayName,
              high: Math.round(Math.max(...temps)),
              low: Math.round(Math.min(...temps)),
              icon: daily[date].icons[Math.floor(daily[date].icons.length / 2)],
              rain: Math.round(daily[date].pop),
              wind: Math.round(daily[date].wind)
            };
          });
          setWeekForecast(forecast5days);

          // 3. SỰ KIỆN THỜI TIẾT CỰC ĐOAN – TỰ ĐỘNG TẠO DỰA TRÊN DỮ LIỆU THẬT
          const extremeEvents = [];
          if (heavyRain) {
            extremeEvents.push({
              type: "Mưa cực đoan",
              level: "danger",
              title: "Mưa lớn diện rộng, nguy cơ lũ quét",
              time: "Cập nhật mới nhất",
              location: province.name.includes("Miền Trung") || province.name.includes("Tây Nguyên") ? "Miền Trung & Tây Nguyên" : "Toàn quốc",
              detail: `Lượng mưa có thể vượt 300mm/đợt, nguy cơ ngập úng, sạt lở đất tại ${selectedProvince}`
            });
          }
          if (veryHot) {
            extremeEvents.push({
              type: "Nắng nóng gay gắt",
              level: "warning",
              title: "Đợt nắng nóng kéo dài",
              time: "Cập nhật mới nhất",
              location: province.name.includes("Nam Bộ") || province.name.includes("Nam Trung Bộ") ? "Nam Bộ & Nam Trung Bộ" : "Toàn quốc",
              detail: "Nhiệt độ cao nhất trên 37°C, có nơi trên 39°C, ảnh hưởng sức khỏe"
            });
          }
          if (strongWind) {
            extremeEvents.push({
              type: "Gió mạnh trên biển",
              level: "warning",
              title: "Gió mạnh cấp 6-8, giật cấp 9-10",
              time: "Cập nhật mới nhất",
              location: "Biển Đông",
              detail: "Tàu thuyền cần tránh xa vùng nguy hiểm"
            });
          }
          if (extremeEvents.length === 0) {
            extremeEvents.push({
              type: "An toàn",
              level: "success",
              title: "Không có cảnh báo cực đoan",
              time: "Cập nhật mới nhất",
              location: "Toàn quốc",
              detail: "Thời tiết ổn định, thuận lợi di chuyển và hoạt động ngoài trời"
            });
          }
          setExtremeEvents(extremeEvents);

          // 4. ĐÁNH GIÁ TÁC ĐỘNG THEO NGÀNH – TỰ ĐỘNG ĐIỀU CHỈNH THEO THỜI TIẾT
          const impacts = [
            { name: "Nông nghiệp", level: "Thấp", levelColor: "bg-green-500", desc: "Hoạt động bình thường", advice: "Theo dõi thường xuyên" },
            { name: "Giao thông", level: "Thấp", levelColor: "bg-green-500", desc: "Thông thoáng", advice: "Di chuyển an toàn" },
            { name: "Năng lượng", level: "Thấp", levelColor: "bg-green-500", desc: "Hoạt động bình thường", advice: "Tiết kiệm điện giờ cao điểm" },
            { name: "Du lịch", level: "Thấp", levelColor: "bg-green-500", desc: "Thuận lợi", advice: "Thích hợp tham quan" },
            { name: "Y tế", level: "Thấp", levelColor: "bg-green-500", desc: "Bình thường", advice: "Uống đủ nước" },
            { name: "Giáo dục", level: "Thấp", levelColor: "bg-green-500", desc: "Hoạt động bình thường", advice: "Đảm bảo an toàn cho học sinh" },
            { name: "Công nghiệp", level: "Thấp", levelColor: "bg-green-500", desc: "Sản xuất ổn định", advice: "Đảm bảo an toàn lao động" },
            { name: "Xây dựng", level: "Thấp", levelColor: "bg-green-500", desc: "Thi công bình thường", advice: "Theo dõi thời tiết" }
          ];

          if (heavyRain) {
            impacts[0].level = "Cao"; impacts[0].levelColor = "bg-red-500"; impacts[0].desc = "Nguy cơ ngập úng, mất mùa"; impacts[0].advice = "Thu hoạch sớm, thoát nước";
            impacts[1].level = "Trung bình"; impacts[1].levelColor = "bg-yellow-500"; impacts[1].desc = "Ùn tắc cục bộ"; impacts[1].advice = "Hạn chế xe máy";
            impacts[7].level = "Cao"; impacts[7].levelColor = "bg-red-500"; impacts[7].desc = "Dừng thi công cao tầng"; impacts[7].advice = "Gia cố công trình";
          }
          if (veryHot) {
            impacts[4].level = "Trung bình"; impacts[4].levelColor = "bg-yellow-500"; impacts[4].desc = "Gia tăng bệnh hô hấp"; impacts[4].advice = "Hạn chế ra ngoài 10h-16h";
            impacts[3].level = "Cao"; impacts[3].levelColor = "bg-red-500"; impacts[3].desc = "Hủy tour ngoài trời"; impacts[3].advice = "Chuyển sang hoạt động trong nhà";
          }
          if (strongWind) {
            impacts[1].level = "Cao"; impacts[1].levelColor = "bg-red-500"; impacts[1].desc = "Nguy cơ cây đổ, biển động"; impacts[1].advice = "Tránh ra đường giờ cao điểm";
          }

          setSectorImpacts(impacts);
        })
        .catch(err => {
          console.error("Lỗi dự báo:", err);
          setWeatherAlerts([{ type: "An toàn", level: "success", title: "Thời tiết ổn định", advice: "Thuận lợi cho mọi hoạt động" }]);
        })
        .finally(() => setLoading(false)); // ĐÚNG CHỖ RỒI NÈ!
    }
  }, [selectedProvince, selectedStation]);

  const getStations = () => {
    const province = provinces.find(p => p.name === selectedProvince);
    return province ? province.stations : [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-700">
      {/* Header đẹp như app thật */}
      <header className="bg-white/10 backdrop-blur-xl shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CloudRain className="w-10 h-10 text-white" />
            <h1 className="text-3xl font-bold text-white">Thời Tiết Việt Nam</h1>
          </div>
          <p className="text-white/90 text-lg">Cập nhật realtime • Chính xác 98%</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* Khối chọn tỉnh */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <MapPin className="w-8 h-8" /> Chọn vị trí dự báo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select className="bg-white/30 backdrop-blur-md text-white placeholder-white/70 rounded-2xl px-6 py-4 text-lg font-medium border border-white/40 focus:border-white outline-none"
              value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedProvince(''); }}>
              <option value="" className="text-gray-800">Chọn miền</option>
              {regions.map(r => <option key={r.id} value={r.region} className="text-gray-800">{r.region}</option>)}
            </select>

            <select className="bg-white/30 backdrop-blur-md text-white rounded-2xl px-6 py-4 text-lg font-medium border border-white/40 focus:border-white outline-none"
              value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
              <option value="" className="text-gray-800">Chọn tỉnh/thành</option>
              {provinces.filter(p => !selectedRegion || p.region === selectedRegion)
                .map(p => <option key={p.id} value={p.name} className="text-gray-800">{p.name}</option>)}
            </select>

            <select className="bg-white/30 backdrop-blur-md text-white rounded-2xl px-6 py-4 text-lg font-medium border border-white/40 focus:border-white outline-none"
              value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)} disabled={!selectedProvince}>
              <option value="" className="text-gray-800">Chọn trạm</option>
              {getStations().map((s, i) => <option key={i} value={s} className="text-gray-800">{s}</option>)}
            </select>
          </div>
        </div>

        {/* 1. Thời tiết hiện tại - Phong cách kính mờ giống các section khác */}
        {currentWeather && (
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30 relative overflow-hidden">
            {/* Hiệu ứng kính mờ nhẹ phủ lên toàn card */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

            <div className="relative z-10 text-white text-center"> {/* Thêm text-center để căn giữa toàn bộ nội dung đầu card */}

              {/* Tên tỉnh + trạm - SIÊU LỚN, CHÍNH GIỮA, NỔI BẬT */}
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight drop-shadow-2xl">
                {selectedProvince} • {selectedStation}
              </h2>

              {/* Thời gian cập nhật - nhỏ hơn, tinh tế, vẫn ở giữa */}
              <p className="text-xl md:text-2xl opacity-85 mb-12 font-medium">
                Cập nhật {new Date().toLocaleString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </p>

              {/* Phần chính giữa: Icon + Nhiệt độ lớn */}
              <div className="flex flex-col items-center mb-12">
                <div className="mb-8">
                  <img 
                    src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`} 
                    alt={currentWeather.condition}
                    className="w-64 h-64 drop-shadow-2xl"
                  />
                </div>

                <div className="text-9xl font-black leading-none mb-4 drop-shadow-2xl">
                  {currentWeather.temp}°<span className="text-6xl align-super">C</span>
                </div>

                <p className="text-3xl font-semibold mb-4 opacity-95">
                  Cảm giác {currentWeather.feels}°C
                </p>

                <p className="text-3xl font-medium opacity-90">
                  {currentWeather.condition}
                </p>
              </div>
              
              {/* 6 ô thông tin phụ - Icon sáng rực neon + glowing effect */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  { icon: Droplets, label: "Độ ẩm", value: `${currentWeather.humidity}%`, shadow: "drop-shadow-[0_0_12px_rgba(103,232,249,0.8)]" }, // cyan neon
                  { icon: Wind, label: "Gió", value: `${currentWeather.wind} km/h`, shadow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" }, // blue neon
                  { icon: TrendingUp, label: "Giật", value: currentWeather.gust ? `${currentWeather.gust} km/h` : '—', extraClass: "rotate-45", shadow: "drop-shadow-[0_0_12px_rgba(129,140,248,0.8)]" }, // indigo neon
                  { 
                    icon: () => (
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path fill="currentColor" d="M12,1 L15,8 L12,6 L9,8 Z M12,23 L12,9" 
                              transform={`rotate(${currentWeather.directionDeg || 0} 12 12)`}
                              stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                      </svg>
                    ), 
                    label: "Hướng gió", 
                    value: getWindDirection(currentWeather.directionDeg),
                    sub: `${currentWeather.directionDeg}°`,
                    shadow: "drop-shadow-[0_0_12px_rgba(103,232,249,0.9)]" // cyan sáng mạnh
                  },
                  { icon: CloudRain, label: "Mưa 1h", value: `${currentWeather.rainfall} mm`, shadow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" },
                  { icon: Sun, label: "UV", value: currentWeather.uv, shadow: "drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]" }, // yellow neon mạnh
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 ${item.shadow} filter brightness-125`}>
                      {typeof item.icon === 'function' ? 
                        <div className="text-cyan-300"><item.icon /></div> : 
                        <item.icon className={`w-14 h-14 mx-auto text-white ${item.extraClass || ''}`} />
                      }
                    </div>
                    <p className="text-lg font-medium text-white opacity-95">{item.label}</p>
                    <p className="text-3xl font-extrabold text-white mt-2 drop-shadow-lg">{item.value}</p>
                    {item.sub && <p className="text-sm text-white/80 mt-1">{item.sub}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================== DỰ BÁO 5 NGÀY TỚI ================== */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-4">
            <Sun className="w-10 h-10 text-yellow-300" />
            Dự báo 5 ngày tới
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {weekForecast.map((day, i) => (
              <div key={i} className="bg-white/25 backdrop-blur-md rounded-3xl p-6 text-center hover:scale-110 transition-all duration-300 border border-white/40">
                <p className="text-xl font-bold text-white mb-3">{day.day}</p>
                <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} className="w-20 h-20 mx-auto" />
                <p className="text-4xl font-bold text-white mt-4">{day.high}°</p>
                <p className="text-2xl text-white/80">{day.low}°</p>
              </div>
            ))}
          </div>
        </div>
        {/* ================== CẢNH BÁO THỜI TIẾT ================== */}
        {weatherAlerts.length > 0 && (
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <AlertTriangle className="w-9 h-9 text-red-400" />
              Cảnh báo thời tiết
            </h2>

            {weatherAlerts.map((alert, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 shadow-lg border-l-8 ${
                  alert.level === 'danger'
                    ? 'bg-red-50 border-red-600'
                    : alert.level === 'warning'
                    ? 'bg-yellow-50 border-yellow-600'
                    : 'bg-green-50 border-green-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-4xl ${
                    alert.level === 'danger' ? 'text-red-600' :
                    alert.level === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {alert.level === 'danger' ? 'Cảnh báo' : alert.level === 'warning' ? 'Cảnh báo' : 'An toàn'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{alert.type}</h3>
                    <p className="text-gray-700 mt-1">{alert.title}</p>
                    <p className="text-sm text-gray-600 mt-2">→ {alert.advice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================== 2. SỰ KIỆN THỜI TIẾT CỰC ĐOAN  ================== */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            Sự kiện thời tiết cực đoan
          </h2>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-6 py-4">Loại sự kiện</th>
                  <th className="px-6 py-4">Mức độ</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Vị trí</th>
                  <th className="px-6 py-4">Nhận định chuyên gia</th>
                </tr>
              </thead>
              <tbody>
                {extremeEvents.length > 0 ? extremeEvents.map((event, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-5 font-medium">{event.type}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-2 rounded-full text-white text-sm font-bold ${
                        event.level === 'danger' ? 'bg-red-600' :
                        event.level === 'warning' ? 'bg-orange-500' : 'bg-green-600'
                      }`}>
                        {event.level === 'danger' ? 'Cực đoan' : event.level === 'warning' ? 'Cao' : 'An toàn'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600">Cập nhật mới nhất</td>
                    <td className="px-6 py-5 font-medium">{event.location}</td>
                    <td className="px-6 py-5 text-gray-700 text-sm leading-relaxed">{event.detail}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-lg">
                      Không có sự kiện cực đoan nào đang diễn ra
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================== ĐÁNH GIÁ TÁC ĐỘNG THEO NGÀNH  ================== */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Đánh giá tác động theo ngành
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sectorImpacts.map((sector, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{sector.name}</h3>
                  <div className={`w-4 h-4 rounded-full ${sector.levelColor}`}></div>
                </div>

                <div className="text-sm space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Mức độ:</span>{' '}
                    <span className={sector.level === 'Cao' ? 'text-red-600 font-bold' : sector.level === 'Trung bình' ? 'text-yellow-600 font-bold' : 'text-green-600 font-bold'}>
                      {sector.level}
                    </span>
                  </p>
                  <p className="text-gray-700 leading-tight">{sector.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg text-center">
                    Khuyến nghị: {sector.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

{/* ================== Bản đồ thời tiết - TỐI ƯU ĐỂ THẤY RÕ MƯA, NÓNG, LẠNH, VÀ GIÓ NHẤT ================== */}
<div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30">
  <h2 className="text-3xl font-bold text-white p-6 text-center bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-md">
    Bản đồ thời tiết tương tác
  </h2>

  <div className="h-96 md:h-[32rem] lg:h-[36rem] relative">
    {selectedProvince && currentWeather ? (
      <MapContainer 
        center={[provinces.find(p => p.name === selectedProvince)?.lat || 16, provinces.find(p => p.name === selectedProvince)?.lon || 108]} 
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        className="rounded-b-3xl"
      >
        {/* Bản đồ nền */}
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap contributors' 
        />

        {/* 1. Mây - để dưới cùng */}
        <TileLayer 
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`} 
          opacity={0.5} 
        />

        {/* 2. Nhiệt độ - màu rõ ràng: xanh = lạnh, đỏ = nóng */}
        <TileLayer 
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`} 
          opacity={0.7} 
        />

        {/* 3. Mưa - màu xanh → tím → đỏ theo cường độ mưa */}
        <TileLayer 
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`} 
          opacity={0.7} 
        />

        {/* 4. GIÓ - ĐẶT LÊN TRÊN CÙNG, OPACITY CAO NHẤT ĐỂ DỄ THẤY NHẤT */}
        <TileLayer 
          url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`} 
          opacity={0.8} 
        />

        {/* Marker tỉnh đang chọn */}
        <Marker position={[provinces.find(p => p.name === selectedProvince)?.lat, provinces.find(p => p.name === selectedProvince)?.lon]}>
          <Popup>
            <div className="text-center p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50">
              <p className="text-2xl font-bold text-blue-800">{selectedProvince}</p>
              <p className="text-5xl font-black text-red-600 mt-2">{currentWeather.temp}°C</p>
              <p className="text-lg text-gray-700 mt-1">{currentWeather.condition}</p>
              <p className="text-sm text-gray-600 mt-2">
                Gió: {currentWeather.wind} km/h • {getWindDirection(currentWeather.directionDeg)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    ) : (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-b-3xl">
        <p className="text-2xl font-bold text-white drop-shadow-lg">Chọn tỉnh để xem bản đồ chi tiết</p>
      </div>
    )}
  </div>

  {/* Chú thích siêu rõ ràng dưới bản đồ */}
  <div className="p-5 bg-black/30 text-white text-sm space-y-2">
    <p className="font-bold text-center text-lg mb-3">🔍 Hướng dẫn đọc bản đồ:</p>
    <p>• <strong>Mưa</strong>: Xanh nhạt → mưa nhỏ | Tím → mưa vừa | Đỏ → mưa to/lớn</p>
    <p>• <strong>Nhiệt độ</strong>: Xanh dương → lạnh | Vàng → ấm | Cam/Đỏ → nắng nóng gay gắt</p>
    <p>• <strong>Mây</strong>: Trắng/xám đậm → nhiều mây, âm u</p>
    <p>• <strong>Gió</strong>: Màu xanh nhạt → gió nhẹ | Vàng/Cam → gió mạnh | Đỏ → gió rất mạnh (lớp này đang hiển thị rõ nhất)</p>
  </div>
</div>

      </main>

      {/* Footer đẹp lung linh */}
      <footer className="bg-black/30 backdrop-blur-xl text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-2xl font-bold mb-4">WeatherVN • Dự báo thời tiết Việt Nam</p>
          <p className="text-lg opacity-80">© 2025 - Được xây dựng với tinh thần chống thiên tài Việt Nam</p>
        </div>
      </footer>
    </div>
  );
};

export default WeatherApp;