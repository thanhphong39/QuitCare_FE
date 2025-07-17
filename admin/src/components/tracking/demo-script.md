# 🤖 Script Tự Động Điền Dữ Liệu Tracking - Hướng Dẫn Demo

## 📋 Tổng Quan

Script này được thiết kế để demo cho cô giáo, tự động điền dữ liệu tracking cho kế hoạch cai thuốc 2 tuần, **trừ ngày cuối cùng** để người dùng tự nhập và kích hoạt modal hoàn thành.

## 🎯 Tính Năng Chính

### 1. **Auto-Fill Dữ Liệu** 🤖

- Tự động điền 13 ngày đầu (với kế hoạch 14 ngày)
- Để lại ngày cuối cùng để người dùng tự nhập
- Dữ liệu đa dạng, thực tế với tiến bộ theo thời gian

### 2. **Phân Biệt Loại Dữ Liệu** 🏷️

- **✓** - Dữ liệu người dùng tự nhập
- **🤖** - Dữ liệu auto-filled (demo)
- **🔧** - Dữ liệu test (nếu có)

### 3. **Thống Kê Chính Xác** 📊

- Modal hoàn thành chỉ tính dữ liệu người dùng thật
- Hiển thị riêng số ngày demo vs thật
- Cảnh báo rõ ràng về dữ liệu demo

## 🎮 Cách Sử Dụng

### Bước 1: Chuẩn Bị

1. Đảm bảo có kế hoạch cai thuốc (tự tạo hoặc hệ thống)
2. Bật Test Mode trong code (`isTestMode = true`)

### Bước 2: Chạy Script Demo

1. Vào trang Tracking
2. Nhấn nút **"🤖 Điền dữ liệu 2 tuần (trừ ngày cuối)"**
3. Đợi script hoàn thành (~1-2 giây)

### Bước 3: Kiểm Tra Kết Quả

- Calendar sẽ hiển thị 🤖 cho các ngày đã auto-fill
- Stats sẽ cập nhật với dữ liệu mới
- Ngày cuối vẫn trống để nhập

### Bước 4: Test Modal Hoàn Thành

1. Chọn ngày cuối cùng trong calendar
2. Nhập dữ liệu tracking (số điếu, triệu chứng, ghi chú)
3. Nhấn "Lưu dữ liệu"
4. Modal hoàn thành sẽ xuất hiện! 🎉

## 📊 Dữ Liệu Mẫu Được Tạo

### Đặc Điểm Dữ Liệu:

- **Số điếu giảm dần** theo thời gian (mô phỏng tiến bộ)
- **Triệu chứng đa dạng** (thèm thuốc, ho, thay đổi tâm trạng...)
- **Ghi chú thực tế** về quá trình cai thuốc
- **Ngẫu nhiên nhẹ** để tránh dữ liệu quá đều

### Ví Dụ Progression:

```
Ngày 1: 8 điếu (Thèm thuốc nhiều)
Ngày 3: 5 điếu (Ho nhiều hơn)
Ngày 7: 2 điếu (Tiến bộ rõ rệt)
Ngày 10: 0 điếu (Hoàn toàn không hút)
Ngày 13: 1 điếu (Thỉnh thoảng thèm)
Ngày 14: [Để người dùng nhập]
```

## 🔧 Tính Năng Kỹ Thuật

### API Tích Hợp:

- Tùy chọn gửi API thật (hiện tại bị comment)
- Lưu vào localStorage
- Đồng bộ với state React

### Performance:

- Delay 100ms giữa các ngày để tránh spam
- Progress indicator trong quá trình tạo
- Rollback nếu có lỗi

### Data Safety:

- Chỉ tạo dữ liệu cho ngày chưa có
- Đánh dấu rõ ràng `isAutoFilled: true`
- Có nút xóa để reset hoàn toàn

## 🎯 Kịch Bản Demo Cho Cô

### Scenario 1: Demo Đầy Đủ (5 phút)

1. **Khởi tạo**: "Cô xem, đây là trang tracking trống"
2. **Auto-fill**: "Em sẽ mô phỏng 13 ngày đầu bằng script"
3. **Hiển thị**: "Các ngày có 🤖 là dữ liệu demo, ✓ sẽ là thật"
4. **Nhập cuối**: "Ngày cuối em sẽ nhập thử để hoàn thành"
5. **Modal kết quả**: "Và đây là modal hoàn thành khóa học!"

### Scenario 2: So Sánh (3 phút)

1. **Trước**: Trang trống
2. **Sau**: Đầy dữ liệu với phân biệt rõ ràng
3. **Thống kê**: Chỉ tính dữ liệu thật vào kết quả

### Scenario 3: Reset & Test (2 phút)

1. **Xóa**: Dùng nút "🗑️ Xóa tất cả"
2. **Tạo lại**: Chạy script lần nữa
3. **Consistency**: Dữ liệu luôn ổn định

## ⚠️ Lưu Ý Quan Trọng

### Cho Cô Giáo:

- Đây chỉ là **DEMO** để minh họa flow
- Dữ liệu thật sẽ do người dùng nhập hàng ngày
- Script giúp tiết kiệm thời gian demo
- Modal hoàn thành đã có sẵn trong code

### Cho Development:

- Chuyển `isTestMode = false` khi production
- Bỏ comment API calls nếu muốn gửi thật
- Có thể tùy chỉnh dữ liệu mẫu trong `sampleDataTemplates`

## 🚀 Kết Quả Mong Đợi

Sau khi chạy script và hoàn thành ngày cuối:

- ✅ Calendar đầy dữ liệu với phân biệt rõ ràng
- ✅ Stats chính xác (chỉ tính dữ liệu thật)
- ✅ Modal hoàn thành xuất hiện
- ✅ Thống kê tiết kiệm thuốc & tiền
- ✅ Cảm giác hoàn thành thật sự

**🎉 Perfect demo cho cô giáo!**
