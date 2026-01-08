/* Bài tập nói: ghi âm + chấm điểm phát âm qua Azure Speech + GPT-4o-mini */
"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useSession } from "next-auth/react";
import { translateZhToVi } from "@/lib/translate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type AssessResult = {
  transcript?: string;
  assessment?: {
    accuracy?: number;
    fluency?: number;
    completeness?: number;
    pronScore?: number;
    words?: Array<any>;
  };
  aiFeedback?: {
    translation?: string;
    meaning_vi?: string;
    issues?: string[];
    advice?: string;
    raw?: string;
  };
  raw?: any;
  error?: string;
};

const MAX_RECORDING_SECONDS = 30; // Giới hạn 30 giây
type PracticeMode = "word" | "sentence";

// Bộ dữ liệu mẫu để random nhanh (mở rộng 100 từ + 100 câu)
const SAMPLE_WORDS = [
  { text: "你好", vi: "Xin chào" },
  { text: "谢谢", vi: "Cảm ơn" },
  { text: "再见", vi: "Tạm biệt" },
  { text: "请", vi: "Làm ơn / mời" },
  { text: "对不起", vi: "Xin lỗi" },
  { text: "可以", vi: "Có thể" },
  { text: "没问题", vi: "Không vấn đề" },
  { text: "老师", vi: "Giáo viên" },
  { text: "学生", vi: "Học sinh" },
  { text: "朋友", vi: "Bạn bè" },
  { text: "家人", vi: "Gia đình" },
  { text: "同事", vi: "Đồng nghiệp" },
  { text: "医生", vi: "Bác sĩ" },
  { text: "护士", vi: "Y tá" },
  { text: "司机", vi: "Tài xế" },
  { text: "服务员", vi: "Phục vụ" },
  { text: "老板", vi: "Ông chủ" },
  { text: "客人", vi: "Khách" },
  { text: "饭馆", vi: "Nhà hàng" },
  { text: "机场", vi: "Sân bay" },
  { text: "酒店", vi: "Khách sạn" },
  { text: "厕所", vi: "Nhà vệ sinh" },
  { text: "火车站", vi: "Ga tàu" },
  { text: "地铁", vi: "Tàu điện ngầm" },
  { text: "出租车", vi: "Taxi" },
  { text: "公交车", vi: "Xe buýt" },
  { text: "咖啡", vi: "Cà phê" },
  { text: "水", vi: "Nước" },
  { text: "牛奶", vi: "Sữa" },
  { text: "啤酒", vi: "Bia" },
  { text: "米饭", vi: "Cơm" },
  { text: "面条", vi: "Mì" },
  { text: "鸡蛋", vi: "Trứng" },
  { text: "水果", vi: "Trái cây" },
  { text: "蔬菜", vi: "Rau" },
  { text: "早餐", vi: "Bữa sáng" },
  { text: "午餐", vi: "Bữa trưa" },
  { text: "晚餐", vi: "Bữa tối" },
  { text: "明天", vi: "Ngày mai" },
  { text: "昨天", vi: "Hôm qua" },
  { text: "今天", vi: "Hôm nay" },
  { text: "现在", vi: "Bây giờ" },
  { text: "早上", vi: "Buổi sáng" },
  { text: "晚上", vi: "Buổi tối" },
  { text: "时间", vi: "Thời gian" },
  { text: "分钟", vi: "Phút" },
  { text: "小时", vi: "Giờ" },
  { text: "多少", vi: "Bao nhiêu" },
  { text: "为什么", vi: "Tại sao" },
  { text: "怎么", vi: "Như thế nào" },
  { text: "哪里", vi: "Ở đâu" },
  { text: "谁", vi: "Ai" },
  { text: "什么", vi: "Cái gì" },
  { text: "多少钱", vi: "Bao nhiêu tiền" },
  { text: "喜欢", vi: "Thích" },
  { text: "爱", vi: "Yêu" },
  { text: "想", vi: "Muốn" },
  { text: "需要", vi: "Cần" },
  { text: "知道", vi: "Biết" },
  { text: "懂", vi: "Hiểu" },
  { text: "学习", vi: "Học" },
  { text: "工作", vi: "Làm việc" },
  { text: "休息", vi: "Nghỉ ngơi" },
  { text: "旅行", vi: "Du lịch" },
  { text: "购物", vi: "Mua sắm" },
  { text: "看", vi: "Xem / nhìn" },
  { text: "听", vi: "Nghe" },
  { text: "说", vi: "Nói" },
  { text: "读", vi: "Đọc" },
  { text: "写", vi: "Viết" },
  { text: "走", vi: "Đi bộ" },
  { text: "跑", vi: "Chạy" },
  { text: "坐", vi: "Ngồi" },
  { text: "站", vi: "Đứng" },
  { text: "开", vi: "Mở / lái" },
  { text: "关", vi: "Đóng" },
  { text: "快", vi: "Nhanh" },
  { text: "慢", vi: "Chậm" },
  { text: "热", vi: "Nóng" },
  { text: "冷", vi: "Lạnh" },
  { text: "高", vi: "Cao" },
  { text: "低", vi: "Thấp" },
  { text: "多", vi: "Nhiều" },
  { text: "少", vi: "Ít" },
  { text: "大", vi: "To" },
  { text: "小", vi: "Nhỏ" },
  { text: "新", vi: "Mới" },
  { text: "旧", vi: "Cũ" },
  { text: "贵", vi: "Đắt" },
  { text: "便宜", vi: "Rẻ" },
  { text: "漂亮", vi: "Đẹp" },
  { text: "好吃", vi: "Ngon" },
  { text: "重要", vi: "Quan trọng" },
  { text: "方便", vi: "Thuận tiện" },
  { text: "简单", vi: "Đơn giản" },
  { text: "难", vi: "Khó" },
  { text: "安全", vi: "An toàn" },
  { text: "危险", vi: "Nguy hiểm" },
  { text: "健康", vi: "Sức khỏe" },
  { text: "快乐", vi: "Vui vẻ" },
  { text: "担心", vi: "Lo lắng" },
  { text: "累", vi: "Mệt" },
  { text: "饿", vi: "Đói" },
  { text: "渴", vi: "Khát" },
  { text: "满意", vi: "Hài lòng" },
  { text: "需要帮助", vi: "Cần giúp đỡ" },
];

const SAMPLE_SENTENCES = [
  { text: "你好，你今天怎么样？", vi: "Xin chào, hôm nay bạn thế nào?" },
  { text: "我想点一杯咖啡。", vi: "Tôi muốn gọi một ly cà phê." },
  { text: "请问洗手间在哪里？", vi: "Xin hỏi nhà vệ sinh ở đâu?" },
  { text: "这道菜很好吃，谢谢。", vi: "Món này rất ngon, cảm ơn." },
  { text: "对不起，我来晚了。", vi: "Xin lỗi, tôi đến muộn." },
  { text: "可以帮我拍张照片吗？", vi: "Bạn có thể chụp giúp tôi một tấm ảnh không?" },
  { text: "我在学习中文发音。", vi: "Tôi đang học phát âm tiếng Trung." },
  { text: "今天的天气很不错。", vi: "Thời tiết hôm nay rất đẹp." },
  { text: "我想预订一个房间。", vi: "Tôi muốn đặt một phòng." },
  { text: "请慢一点说。", vi: "Làm ơn nói chậm một chút." },
  { text: "我需要一瓶水，谢谢。", vi: "Tôi cần một chai nước, cảm ơn." },
  { text: "请给我看菜单。", vi: "Làm ơn cho tôi xem thực đơn." },
  { text: "我们几点出发？", vi: "Chúng ta xuất phát lúc mấy giờ?" },
  { text: "这附近有地铁站吗？", vi: "Gần đây có ga tàu điện ngầm không?" },
  { text: "请帮我叫一辆出租车。", vi: "Làm ơn gọi giúp tôi một chiếc taxi." },
  { text: "我想换一间房间。", vi: "Tôi muốn đổi sang một phòng khác." },
  { text: "我对花生过敏。", vi: "Tôi dị ứng với lạc." },
  { text: "请不要放辣。", vi: "Làm ơn đừng cho cay." },
  { text: "可以便宜一点吗？", vi: "Có thể rẻ hơn chút không?" },
  { text: "我只是看看，谢谢。", vi: "Tôi chỉ xem thôi, cảm ơn." },
  { text: "我想要一个没有冰的饮料。", vi: "Tôi muốn một đồ uống không đá." },
  { text: "请给我一张收据。", vi: "Cho tôi một hóa đơn." },
  { text: "附近有药店吗？", vi: "Gần đây có hiệu thuốc không?" },
  { text: "我感觉不舒服。", vi: "Tôi cảm thấy không khỏe." },
  { text: "请问怎么去机场？", vi: "Xin hỏi đi sân bay thế nào?" },
  { text: "我需要换钱，在哪里可以换？", vi: "Tôi cần đổi tiền, ở đâu có thể đổi?" },
  { text: "帮我推荐一道本地菜。", vi: "Giới thiệu cho tôi một món địa phương." },
  { text: "这道菜太辣了。", vi: "Món này quá cay." },
  { text: "请给我一杯温水。", vi: "Cho tôi một cốc nước ấm." },
  { text: "我想订明天早上的车票。", vi: "Tôi muốn đặt vé xe sáng mai." },
  { text: "请问现在几点？", vi: "Xin hỏi bây giờ mấy giờ?" },
  { text: "我需要一条毛巾。", vi: "Tôi cần một chiếc khăn." },
  { text: "可以帮我充电吗？", vi: "Bạn có thể giúp tôi sạc điện không?" },
  { text: "这里可以刷卡吗？", vi: "Ở đây có quẹt thẻ được không?" },
  { text: "我丢了钱包，请帮忙。", vi: "Tôi mất ví, xin giúp đỡ." },
  { text: "请问哪里可以打车？", vi: "Xin hỏi ở đâu gọi taxi được?" },
  { text: "这附近有便利店吗？", vi: "Gần đây có cửa hàng tiện lợi không?" },
  { text: "我想买一份早餐。", vi: "Tôi muốn mua một phần bữa sáng." },
  { text: "我想办一张电话卡。", vi: "Tôi muốn mua một SIM điện thoại." },
  { text: "请推荐一家好吃的饭馆。", vi: "Hãy gợi ý một nhà hàng ngon." },
  { text: "我需要打印这些文件。", vi: "Tôi cần in những tài liệu này." },
  { text: "可以给我一个枕头吗？", vi: "Cho tôi xin một cái gối được không?" },
  { text: "我想要一个靠窗的座位。", vi: "Tôi muốn một chỗ ngồi gần cửa sổ." },
  { text: "请问有素食吗？", vi: "Có món chay không?" },
  { text: "请问怎么去最近的地铁站？", vi: "Đi tới ga tàu điện gần nhất như thế nào?" },
  { text: "这道菜里有花生吗？", vi: "Món này có lạc không?" },
  { text: "我想寄一个包裹。", vi: "Tôi muốn gửi một bưu kiện." },
  { text: "我需要一张地图。", vi: "Tôi cần một bản đồ." },
  { text: "这附近有银行吗？", vi: "Gần đây có ngân hàng không?" },
  { text: "我需要去医院。", vi: "Tôi cần đi bệnh viện." },
  { text: "请问怎么去市中心？", vi: "Đi tới trung tâm thành phố thế nào?" },
  { text: "我想学几句基本的中文。", vi: "Tôi muốn học vài câu tiếng Trung cơ bản." },
  { text: "你可以说慢一点吗？", vi: "Bạn có thể nói chậm hơn không?" },
  { text: "我听不太懂，可以再说一次吗？", vi: "Tôi nghe không rõ, bạn nói lại được không?" },
  { text: "这个价格包含早餐吗？", vi: "Giá này đã bao gồm bữa sáng chưa?" },
  { text: "退房时间是几点？", vi: "Giờ trả phòng là mấy giờ?" },
  { text: "请帮我叫醒服务，早上七点。", vi: "Gọi dịch vụ báo thức lúc 7h sáng giúp tôi." },
  { text: "我要办理入住。", vi: "Tôi muốn làm thủ tục nhận phòng." },
  { text: "空调太冷了，请调高一点。", vi: "Điều hòa lạnh quá, tăng nhiệt giúp tôi." },
  { text: "可以给我多一条被子吗？", vi: "Cho tôi thêm một cái chăn được không?" },
  { text: "我想延长住宿一晚。", vi: "Tôi muốn ở thêm một đêm." },
  { text: "请问房间里有吹风机吗？", vi: "Phòng có máy sấy tóc không?" },
  { text: "我需要一把雨伞。", vi: "Tôi cần một chiếc ô." },
  { text: "请问哪里可以兑换货币？", vi: "Ở đâu có thể đổi tiền?" },
  { text: "我想租一辆自行车。", vi: "Tôi muốn thuê một chiếc xe đạp." },
  { text: "我想租一辆汽车。", vi: "Tôi muốn thuê một chiếc ô tô." },
  { text: "油箱要加满吗？", vi: "Có cần đổ đầy xăng không?" },
  { text: "这是我的护照。", vi: "Đây là hộ chiếu của tôi." },
  { text: "请问行李托运在哪里？", vi: "Làm thủ tục hành lý ở đâu?" },
  { text: "登机口在几号？", vi: "Cửa lên máy bay số mấy?" },
  { text: "航班延误了吗？", vi: "Chuyến bay có bị trễ không?" },
  { text: "我要一个靠过道的座位。", vi: "Tôi muốn một ghế gần lối đi." },
  { text: "我想改签这张票。", vi: "Tôi muốn đổi vé này." },
  { text: "请问有直达的车吗？", vi: "Có chuyến thẳng không?" },
  { text: "我需要买一张往返票。", vi: "Tôi cần mua vé khứ hồi." },
  { text: "这趟车多久到？", vi: "Chuyến xe này bao lâu đến?" },
  { text: "你能推荐一些景点吗？", vi: "Bạn có thể gợi ý vài điểm tham quan không?" },
  { text: "我想参加一个本地团。", vi: "Tôi muốn tham gia tour địa phương." },
  { text: "我想学习怎么点菜。", vi: "Tôi muốn học cách gọi món." },
  { text: "这道菜的主要材料是什么？", vi: "Nguyên liệu chính của món này là gì?" },
  { text: "我不吃海鲜。", vi: "Tôi không ăn hải sản." },
  { text: "我要一个不含酒精的饮料。", vi: "Tôi muốn một đồ uống không cồn." },
  { text: "请问有无糖的选择吗？", vi: "Có lựa chọn không đường không?" },
  { text: "请给我一份打包。", vi: "Cho tôi một phần mang đi." },
  { text: "我可以试穿这件衣服吗？", vi: "Tôi có thể thử bộ này không?" },
  { text: "有大一码的吗？", vi: "Có size lớn hơn không?" },
  { text: "请给我开发票。", vi: "Vui lòng xuất hóa đơn cho tôi." },
  { text: "我想预约一个时间。", vi: "Tôi muốn đặt lịch." },
  { text: "请问有空位吗？", vi: "Có chỗ trống không?" },
  { text: "我想取消这个预订。", vi: "Tôi muốn hủy đặt chỗ này." },
  { text: "请问可以提前入住吗？", vi: "Có thể check-in sớm không?" },
  { text: "我需要加一张床。", vi: "Tôi cần thêm một giường." },
  { text: "我想寄存行李几个小时。", vi: "Tôi muốn gửi hành lý vài giờ." },
];

export default function SpeakingContent() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken ?? null;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [mode, setMode] = useState<PracticeMode>("word");
  const [customPractice, setCustomPractice] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0); // Thời gian ghi âm (giây)
  const [loading, setLoading] = useState(false);
  const [referenceText, setReferenceText] = useState("你好"); // mẫu chuẩn
  const [referenceMeaning, setReferenceMeaning] = useState("Xin chào"); // nghĩa tiếng Việt
  const [result, setResult] = useState<AssessResult | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false); // Trạng thái đang dịch
  const [translatedMeaning, setTranslatedMeaning] = useState(""); // Nghĩa đã dịch của customPractice
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      stopStream(mediaStreamRef);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, [recordedUrl]);

  // Tự động dịch khi nhập từ vào ô customPractice
  useEffect(() => {
    // Clear timeout cũ nếu có
    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current);
    }

    // Nếu ô trống, xóa nghĩa đã dịch
    if (!customPractice.trim()) {
      setTranslatedMeaning("");
      return;
    }

    // Kiểm tra xem từ có trong SAMPLE_WORDS hoặc SAMPLE_SENTENCES không
    const foundInSamples = 
      SAMPLE_WORDS.find(item => item.text === customPractice.trim()) ||
      SAMPLE_SENTENCES.find(item => item.text === customPractice.trim());
    
    if (foundInSamples) {
      // Nếu tìm thấy trong mẫu, dùng nghĩa có sẵn
      setTranslatedMeaning(foundInSamples.vi);
      return;
    }

    // Debounce: đợi 500ms sau khi người dùng ngừng gõ
    setTranslating(true);
    translateTimeoutRef.current = setTimeout(async () => {
      try {
        const translated = await translateZhToVi(customPractice.trim());
        if (translated) {
          setTranslatedMeaning(translated);
        } else {
          setTranslatedMeaning("");
        }
      } catch (err) {
        console.error("Translation error:", err);
        setTranslatedMeaning("");
      } finally {
        setTranslating(false);
      }
    }, 500);

    return () => {
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, [customPractice]);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setRecordingDuration(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = handleStop;
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      
      // Bắt đầu đếm thời gian
      recordingStartTimeRef.current = Date.now();
      recordingTimerRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
          setRecordingDuration(elapsed);
          
          // Tự động dừng khi đạt giới hạn
          if (elapsed >= MAX_RECORDING_SECONDS) {
            stopRecording();
            setError(`Đã đạt giới hạn ${MAX_RECORDING_SECONDS} giây. Vui lòng ghi âm ngắn hơn để đảm bảo chất lượng.`);
          }
        }
      }, 1000);
    } catch (err: any) {
      setError("Không thể truy cập micro. Vui lòng kiểm tra quyền.");
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    setRecording(false);
    stopStream(mediaStreamRef); // tắt mic ngay khi dừng
  };

  // Convert audio sang WAV PCM 16kHz (Azure Speech yêu cầu)
  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Resample to 16kHz
    const sampleRate = 16000;
    const numberOfChannels = 1; // mono
    const length = audioBuffer.length * (sampleRate / audioBuffer.sampleRate);
    const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();
    
    const resampledBuffer = await offlineContext.startRendering();
    
    // Convert to WAV
    const wavBuffer = audioBufferToWav(resampledBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  const handleStop = async () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    const url = URL.createObjectURL(blob);
    setRecordedUrl(url);
    
    // Kiểm tra kích thước file (ước tính)
    const estimatedSizeMB = blob.size / (1024 * 1024);
    if (estimatedSizeMB > 10) {
      setError(`File audio quá lớn (${estimatedSizeMB.toFixed(2)}MB). Vui lòng ghi âm ngắn hơn (tối đa ${MAX_RECORDING_SECONDS} giây).`);
      setLoading(false);
      return;
    }
    
    // Convert sang WAV PCM 16kHz cho Azure Speech
    try {
      const wavBlob = await convertToWav(blob);
      const arrayBuffer = await wavBlob.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      
      // Kiểm tra kích thước base64 (ước tính ~33% lớn hơn)
      const base64SizeMB = (base64.length * 3 / 4) / (1024 * 1024);
      if (base64SizeMB > 45) {
        setError(`Dữ liệu audio quá lớn sau khi mã hóa (${base64SizeMB.toFixed(2)}MB). Vui lòng ghi âm ngắn hơn.`);
        setLoading(false);
        return;
      }
      
      await sendToAssess(base64, "audio/wav");
    } catch (err) {
      console.error("Convert to WAV failed, using original:", err);
      setError("Lỗi khi xử lý audio. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const sendToAssess = async (audioBase64: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/speech/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          referenceText,
          mimeType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Lỗi khi chấm điểm phát âm.");
        setResult(null);
        return;
      }

      setResult(data);

      // Tăng số câu nói đã học trong daily_tasks (chỉ khi mode là sentence)
      if (mode === "sentence" && accessToken) {
        // Gửi request đến server để tăng sentence_count (server sẽ kiểm tra giới hạn và date)
        if (typeof window !== "undefined") {
          fetch(`${API_BASE}/daily-tasks/increment-sentence`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              // Chỉ dispatch event nếu server trả về thành công và có dữ liệu hợp lệ
              if (data && data.sentence_count !== undefined) {
                // Dispatch event để refresh UI với dữ liệu từ server (đảm bảo đúng)
                window.dispatchEvent(new CustomEvent("progress-updated", {
                  detail: { 
                    type: "sentence",
                    value: data.sentence_count // Gửi giá trị tuyệt đối từ server
                  }
                }));
              }
            }
          })
          .catch((error) => {
            // Silent error - không log để tránh spam console
          });
        }
      }
    } catch (err: any) {
      setError("Lỗi mạng hoặc server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const playReference = async () => {
    try {
      const audio = new Audio(`/api/tts?text=${encodeURIComponent(referenceText)}`);
      audio.play();
    } catch {
      setError("Không phát được âm mẫu.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900">Bài tập nói</h2>
        <p className="text-base text-slate-600">
          Ghi âm và chấm điểm tự động theo các tiêu chí: tổng điểm, độ chính xác, độ trôi chảy, mức hoàn chỉnh và từng từ/âm.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {/* Chọn chế độ luyện: từ vựng hoặc câu */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("word");
                setReferenceText("你好");
                setReferenceMeaning("Xin chào");
                setResult(null);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                mode === "word"
                  ? "bg-emerald-500 text-white border-emerald-500 shadow"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              📚 Nói theo từ vựng
            </button>
            <button
              onClick={() => {
                setMode("sentence");
                setReferenceText("你好，你今天怎么样");
                setReferenceMeaning("Xin chào, hôm nay bạn thế nào");
                setResult(null);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                mode === "sentence"
                  ? "bg-emerald-500 text-white border-emerald-500 shadow"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              📝 Nói theo câu
            </button>
          </div>

          {/* Nút gợi ý ngẫu nhiên */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const pick = SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];
                setMode("word");
                setReferenceText(pick.text);
                setReferenceMeaning(pick.vi);
                setCustomPractice(""); // Xóa nội dung trong ô tự nhập
                setTranslatedMeaning(""); // Xóa nghĩa đã dịch
                setResult(null);
              }}
              className="rounded-xl px-4 py-2 text-sm font-semibold border bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
            >
              🎲 Gợi ý từ ngẫu nhiên
            </button>
            <button
              onClick={() => {
                const pick = SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)];
                setMode("sentence");
                setReferenceText(pick.text);
                setReferenceMeaning(pick.vi);
                setCustomPractice(""); // Xóa nội dung trong ô tự nhập
                setTranslatedMeaning(""); // Xóa nghĩa đã dịch
                setResult(null);
              }}
              className="rounded-xl px-4 py-2 text-sm font-semibold border bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
            >
              🎲 Gợi ý câu ngẫu nhiên
            </button>
          </div>

          {/* Ô nhập từ/câu tùy chọn để luyện ngay */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Tự nhập từ / câu muốn luyện</p>
            <input
              value={customPractice}
              onChange={(e) => setCustomPractice(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Nhập từ hoặc câu, ví dụ: 早上好 / 今天我很忙"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!customPractice.trim()) return;
                  setMode("word");
                  setReferenceText(customPractice.trim());
                  // Sử dụng nghĩa đã dịch, nếu chưa có thì thử dịch ngay
                  if (translatedMeaning) {
                    setReferenceMeaning(translatedMeaning);
                  } else {
                    try {
                      const translated = await translateZhToVi(customPractice.trim());
                      if (translated) {
                        setReferenceMeaning(translated);
                        setTranslatedMeaning(translated);
                      }
                    } catch (err) {
                      console.error("Translation error:", err);
                    }
                  }
                  setResult(null);
                  setError(null);
                }}
                className="rounded-lg px-3 py-2 text-xs font-semibold border bg-emerald-500 text-white border-emerald-500 shadow hover:bg-emerald-600"
              >
                Dùng làm mẫu (chấm theo từ)
              </button>
              <button
                onClick={async () => {
                  if (!customPractice.trim()) return;
                  setMode("sentence");
                  setReferenceText(customPractice.trim());
                  // Sử dụng nghĩa đã dịch, nếu chưa có thì thử dịch ngay
                  if (translatedMeaning) {
                    setReferenceMeaning(translatedMeaning);
                  } else {
                    try {
                      const translated = await translateZhToVi(customPractice.trim());
                      if (translated) {
                        setReferenceMeaning(translated);
                        setTranslatedMeaning(translated);
                      }
                    } catch (err) {
                      console.error("Translation error:", err);
                    }
                  }
                  setResult(null);
                  setError(null);
                }}
                className="rounded-lg px-3 py-2 text-xs font-semibold border bg-blue-500 text-white border-blue-500 shadow hover:bg-blue-600"
              >
                Dùng làm mẫu (chấm theo câu)
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Khi bấm, hệ thống sẽ thay mẫu hiện tại bằng nội dung bạn nhập và chấm điểm theo chế độ bạn chọn.
            </p>
          </div>

          <label className="text-sm font-semibold text-slate-700">Câu mẫu (Reference)</label>
          <input
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none"
            placeholder={
              mode === "word" ? "Nhập từ muốn luyện, ví dụ: 你好" : "Nhập câu muốn luyện, ví dụ: 你好，你今天怎么样"
            }
          />
          <label className="text-sm font-semibold text-slate-700">
            Nghĩa tiếng Việt
            {translating && customPractice.trim() && (
              <span className="ml-2 text-xs text-emerald-600">🔄 Đang dịch...</span>
            )}
            {!translating && customPractice.trim() && translatedMeaning && (
              <span className="ml-2 text-xs text-emerald-600">✓ Đã dịch</span>
            )}
          </label>
          <input
            value={customPractice.trim() && translatedMeaning ? translatedMeaning : referenceMeaning}
            onChange={(e) => {
              // Nếu đang có customPractice, cập nhật translatedMeaning
              // Nếu không, cập nhật referenceMeaning
              if (customPractice.trim()) {
                setTranslatedMeaning(e.target.value);
              } else {
                setReferenceMeaning(e.target.value);
              }
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none"
            placeholder="Nghĩa sẽ được tự động dịch khi bạn nhập từ"
          />
          <div className="flex gap-3">
            <button
              onClick={playReference}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600"
            >
              🔊 Nghe mẫu
            </button>
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow ${
                recording ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {recording ? "⏹ Dừng ghi" : "🎙️ Bắt đầu ghi"}
            </button>
          </div>
          
          {/* Hiển thị thời gian ghi âm và cảnh báo */}
          {recording && (
            <div className={`rounded-lg border p-3 ${
              recordingDuration >= MAX_RECORDING_SECONDS - 5
                ? "border-yellow-300 bg-yellow-50"
                : "border-blue-200 bg-blue-50"
            }`}>
              <p className="text-sm font-semibold text-slate-700">
                ⏱️ Đang ghi: {recordingDuration}s / {MAX_RECORDING_SECONDS}s
              </p>
              {recordingDuration >= MAX_RECORDING_SECONDS - 5 && recordingDuration < MAX_RECORDING_SECONDS && (
                <p className="text-xs text-yellow-700 mt-1">
                  ⚠️ Sắp đạt giới hạn! Hệ thống sẽ tự động dừng sau {MAX_RECORDING_SECONDS - recordingDuration} giây.
                </p>
              )}
            </div>
          )}
          
          {!recording && recordingDuration > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="text-xs text-slate-600">
                📊 Thời gian ghi âm: {recordingDuration} giây
                {recordingDuration > MAX_RECORDING_SECONDS && (
                  <span className="text-red-600 font-semibold ml-2">
                    (Quá giới hạn {MAX_RECORDING_SECONDS}s - có thể gặp lỗi)
                  </span>
                )}
              </p>
            </div>
          )}
          
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-2">
            <p className="text-xs text-blue-700">
              💡 <strong>Lưu ý:</strong> Ghi âm tối đa {MAX_RECORDING_SECONDS} giây để đảm bảo chất lượng và tốc độ xử lý tốt nhất. Chế độ hiện tại:{" "}
              <span className="font-semibold">
                {mode === "word" ? "Nói theo từ vựng (điểm từng từ rõ ràng)" : "Nói theo câu (điểm cả câu và từng từ)"}
              </span>
            </p>
          </div>
          
          {loading && <p className="text-sm text-emerald-700">Đang chấm điểm...</p>}
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
          <h3 className="text-lg font-bold text-emerald-900">Kết quả</h3>
          {recordedUrl && (
            <div className="rounded-xl bg-white p-3 border border-emerald-100">
              <p className="text-xs font-semibold text-slate-500 mb-1">Bản ghi tạm (mất khi tải lại trang)</p>
              <audio controls src={recordedUrl} className="w-full" />
            </div>
          )}
          {result ? (
            <>
              {/* Điểm tổng */}
              {result.assessment?.pronScore != null && (
                <div className="rounded-xl bg-white p-4 border-2 border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Điểm tổng</p>
                  <ScoreBox 
                    label="Pronunciation Score" 
                    value={result.assessment.pronScore} 
                    isMain={true}
                  />
                </div>
              )}
              
              <div className="rounded-xl bg-white p-3 border border-emerald-100">
                <p className="text-xs font-semibold text-slate-500">Transcript</p>
                <p className="text-base font-semibold text-slate-900">{result.transcript || "—"}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <ScoreBox label="Accuracy" value={result.assessment?.accuracy} />
                <ScoreBox label="Fluency" value={result.assessment?.fluency} />
                <ScoreBox label="Completeness" value={result.assessment?.completeness} />
              </div>
              
              {/* Chi tiết từng từ */}
              {result.assessment?.words && result.assessment.words.length > 0 && (
                <div className="rounded-xl bg-white p-4 border border-emerald-100">
                  <p className="text-sm font-bold text-slate-700 mb-3">📝 Chi tiết từng từ</p>
                  <div className="space-y-3">
                    {result.assessment.words.map((word: any, idx: number) => (
                      <WordDetailBox 
                        key={idx} 
                        word={word.Word || word.word || ""} 
                        score={word.AccuracyScore || word.accuracyScore} 
                        errorType={word.ErrorType || word.errorType}
                        syllables={word.Syllables || word.syllables}
                        phonemes={word.Phonemes || word.phonemes}
                        offset={word.Offset || word.offset}
                        duration={word.Duration || word.duration}
                      />
                    ))}
                  </div>
                </div>
              )}
              {result.aiFeedback && (
                <div className="rounded-xl bg-white p-3 border border-emerald-100 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">GPT-4o-mini feedback</p>
                  {result.aiFeedback.translation && (
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">Dịch:</span> {result.aiFeedback.translation}
                    </p>
                  )}
                  {result.aiFeedback.meaning_vi && (
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">Nghĩa tiếng Việt:</span> {result.aiFeedback.meaning_vi}
                    </p>
                  )}
                  {result.aiFeedback.issues && result.aiFeedback.issues.length > 0 && (
                    <ul className="list-disc pl-4 text-sm text-slate-800">
                      {result.aiFeedback.issues.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  )}
                  {result.aiFeedback.advice && (
                    <p className="text-sm text-emerald-800">
                      <span className="font-semibold">Gợi ý:</span> {result.aiFeedback.advice}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-600">Ghi âm và nhấn chấm điểm để xem kết quả.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Hàm lấy màu sắc dựa trên điểm số
function getScoreColor(score: number | null | undefined): {
  bg: string;
  border: string;
  text: string;
  label: string;
} {
  if (score == null) {
    return {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-500",
      label: "—",
    };
  }
  
  const roundedScore = Math.round(score);
  
  if (roundedScore < 60) {
    return {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-700",
      label: "Sai",
    };
  } else if (roundedScore >= 60 && roundedScore <= 80) {
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      text: "text-yellow-700",
      label: "Tạm",
    };
  } else {
    return {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-700",
      label: "Tốt",
    };
  }
}

function ScoreBox({ 
  label, 
  value, 
  isMain = false 
}: { 
  label: string; 
  value?: number;
  isMain?: boolean;
}) {
  const colors = getScoreColor(value);
  const sizeClass = isMain ? "text-3xl" : "text-xl";
  
  return (
    <div className={`rounded-xl p-3 border-2 ${colors.bg} ${colors.border}`}>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className={`${sizeClass} font-bold ${colors.text}`}>
        {value != null ? Math.round(value) : "—"}
      </p>
      {value != null && (
        <p className={`text-xs font-semibold mt-1 ${colors.text}`}>
          {colors.label}
        </p>
      )}
    </div>
  );
}

function WordScoreBox({ 
  word, 
  score, 
  errorType 
}: { 
  word: string; 
  score?: number;
  errorType?: string;
}) {
  const colors = getScoreColor(score);
  const hasError = errorType && errorType !== "None";
  
  return (
    <div className={`inline-flex flex-col items-center rounded-lg px-3 py-2 border ${colors.bg} ${colors.border} ${hasError ? "ring-2 ring-red-300" : ""}`}>
      <p className="text-sm font-bold text-slate-900">{word}</p>
      <p className={`text-xs font-semibold ${colors.text}`}>
        {score != null ? `${Math.round(score)}%` : "—"}
      </p>
      {hasError && (
        <p className="text-xs text-red-600 mt-1">⚠️ {errorType}</p>
      )}
    </div>
  );
}

function WordDetailBox({
  word,
  score,
  errorType,
  syllables,
  phonemes,
  offset,
  duration,
}: {
  word: string;
  score?: number;
  errorType?: string;
  syllables?: any[];
  phonemes?: any[];
  offset?: number;
  duration?: number;
}) {
  const colors = getScoreColor(score);
  const hasError = errorType && errorType !== "None";
  
  // Chuyển đổi error type sang tiếng Việt
  const getErrorTypeVi = (type?: string) => {
    if (!type || type === "None") return null;
    const map: Record<string, string> = {
      "Mispronunciation": "Phát âm sai",
      "Omission": "Bỏ sót",
      "Insertion": "Thêm từ",
      "Repetition": "Lặp lại",
    };
    return map[type] || type;
  };
  
  const errorTypeVi = getErrorTypeVi(errorType);
  
  return (
    <div className={`rounded-lg border-2 p-3 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-base font-bold text-slate-900 mb-1">{word}</p>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${colors.text}`}>
              Điểm: {score != null ? `${Math.round(score)}%` : "—"}
            </span>
            {errorTypeVi && (
              <span className="text-xs text-red-600 font-semibold">
                ⚠️ {errorTypeVi}
              </span>
            )}
            {offset != null && duration != null && (
              <span className="text-xs text-slate-500">
                ⏱️ {((offset || 0) / 10000000).toFixed(1)}s - {((duration || 0) / 10000000).toFixed(1)}s
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Chi tiết syllables nếu có */}
      {syllables && syllables.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-600 mb-1">Âm tiết:</p>
          <div className="flex flex-wrap gap-1">
            {syllables.map((syllable: any, idx: number) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded ${
                  (syllable.AccuracyScore || syllable.accuracyScore || 100) < 60
                    ? "bg-red-100 text-red-700"
                    : (syllable.AccuracyScore || syllable.accuracyScore || 100) < 80
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {syllable.Syllable || syllable.syllable || ""} (
                {Math.round(syllable.AccuracyScore || syllable.accuracyScore || 0)}%)
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Chi tiết phonemes nếu có */}
      {phonemes && phonemes.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-600 mb-1">Phonemes:</p>
          <div className="flex flex-wrap gap-1">
            {phonemes.map((phoneme: any, idx: number) => (
              <span
                key={idx}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  (phoneme.AccuracyScore || phoneme.accuracyScore || 100) < 60
                    ? "bg-red-100 text-red-700"
                    : (phoneme.AccuracyScore || phoneme.accuracyScore || 100) < 80
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
                title={`${phoneme.Phoneme || phoneme.phoneme || ""}: ${Math.round(phoneme.AccuracyScore || phoneme.accuracyScore || 0)}%`}
              >
                {phoneme.Phoneme || phoneme.phoneme || ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert AudioBuffer sang WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  // WAV header
  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };
  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(36 + length * numberOfChannels * 2); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // format chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // chunk size
  setUint16(1); // audio format (1 = PCM)
  setUint16(numberOfChannels);
  setUint32(sampleRate);
  setUint32(sampleRate * numberOfChannels * 2); // byte rate
  setUint16(numberOfChannels * 2); // block align
  setUint16(16); // bits per sample

  // data chunk
  setUint32(0x61746164); // "data"
  setUint32(length * numberOfChannels * 2);

  // convert float32 to int16
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < arrayBuffer.byteLength) {
    for (let i = 0; i < numberOfChannels; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return arrayBuffer;
}

function stopStream(ref: MutableRefObject<MediaStream | null>) {
  const stream = ref.current;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    ref.current = null;
  }
}

