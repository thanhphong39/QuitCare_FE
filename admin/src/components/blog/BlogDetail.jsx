import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./BlogDetail.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const customDescriptions = {
  1: `Hút thuốc lá là thói quen xấu, có hại cho sức khỏe của bạn. Do đó, hãy học cách bỏ hút thuốc lá ngay từ hôm nay để bảo vệ sức khỏe của mình và những người xung quanh. Cảm giác thèm thuốc lá có thể khiến bạn suy sụp khi bạn đang cố gắng bỏ thuốc lá. Sử dụng 13 mẹo cai thuốc lá tốt nhất từ ​​trước đến nay trong bài viết dưới đây để chống lại cảm giác thèm thuốc lá và bỏ hút thuốc lá.

1. Làm sao cai được thuốc lá hay bỏ hút thuốc?
Hầu hết những người sử dụng thuốc lá, cảm giác thèm thuốc lá hoặc thúc giục hút thuốc có thể rất mạnh. Nhưng bạn không hề có những cảm giác thèm ăn này. Khi cảm giác muốn sử dụng thuốc lá xảy ra, hãy nhớ rằng mặc dù nó có thể rất dữ dội, nhưng nó có thể sẽ trôi qua trong vòng 5 đến 10 phút cho dù bạn có hút thuốc lá hay ngậm thuốc lá hay không. Mỗi khi bạn chống lại cơn thèm thuốc lá, bạn đang tiến gần hơn một bước tới việc ngừng sử dụng thuốc lá một cách tốt đẹp.

Điều quan trọng của mẹo cai thuốc lá là bạn không được khuất phục trước các cơn thèm thuốc này. Mặc dù cảm giác thèm ăn có thể dữ dội và gây nên lo lắng, nhưng chúng chỉ là tạm thời. Đối các biện pháp thích hợp và một hệ thống hỗ trợ, theo thời gian, bạn có thể khắc phục vĩnh viễn cảm giác thèm ăn và bỏ thuốc lá.

Dưới đây là một số mẹo cai thuốc lá hiệu quả:

1.1. Liệu pháp thay thế nicotine
Các lựa chọn cho liệu pháp thay thế nicotin sẽ bao gồm:

Nicotine có trong thuốc xịt mũi hoặc ống hít, có thể yêu cầu miếng dán nicotine không kê đơn, kẹo cao su và viên ngậm
Loại thuốc không có chứa nicotine để cai thuốc lá như Zyban (bupropion) và Chantix (varenicline), cần phải có đơn thuốc.
1.2. Tránh các yếu tố kích hoạt cơn thèm thuốc
Các tình huống khiến cho bạn muốn hút thuốc hoặc xảy ra trong khi bạn uống rượu hoặc các tình huống căng thẳng. Bạn cần phải xác định các tình huống kích hoạt và tránh hoàn toàn hoặc tìm cách đối phó với chúng.

1.3. Trì hoãn và củng cố tích cực
Khi cơn thèm thuốc lá xuất hiện thì việc trì hoãn việc hút thuốc bằng cách tìm lý do hoặc đến những khu vực cấm hút thuốc được xem là mẹo cai thuốc lá phổ biến nhất cho đến khi cơn thèm thuốc biến mất có thể sẽ cực kỳ hữu ích. Thói quen ở một mình cũng có thể khiến cho bạn muốn quay trở lại thói quen hút thuốc. Do đó, hạn chế việc ở một mình nếu bạn lo sợ là mình sẽ hút thuốc.

1.4. Cơ chế đối phó
Các cơ chế đối phó khác nhau có thể giúp bạn vượt qua cơn thèm thuốc lá. Nhai kẹo cao su, kẹo, nhấm các loại hạt hoặc bất cứ thứ gì dai hoặc giòn có thể sẽ hữu ích. Đánh răng để lại cảm giác sạch sẽ trong miệng và có thể giúp cho bạn loại bỏ cảm giác thèm thuốc lá. Đánh lạc hướng bản thân bằng cách thực hiện các hoạt động khác, chẳng hạn như rửa bát, xem TV, chơi với thú cưng hoặc nói chuyện với bạn bè và gia đình để vượt qua được cơn thèm thuốc.

1.5. Hoạt động thể chất và sở thích của bạn
Mẹo cai thuốc lá lành mạnh bằng các hoạt động thể chất gồm tập thể dục, thể thao, yoga, đi bộ nhanh, và thậm chí khiêu vũ có thể giúp giảm cơn thèm thuốc lá. Nếu không thể hoạt động thể chất, trau dồi các sở thích như viết lách, nghệ thuật, làm thủ công và thậm chí là việc nhà cũng có thể hữu ích không kém.

1.6. Quản lý áp lực căng thẳng
Quản lý căng thẳng là cần thiết đối với những người có thói quen hút thuốc lá do căng thẳng. Quản lý căng thẳng bằng cách thực hành các kỹ thuật thư giãn như các bài tập thở sâu, yoga, tưởng tượng, thiền, mát xa hoặc nghe nhạc êm dịu có thể hữu ích.
1.7. Chế độ ăn uống
Uống nhiều nước vàtrà xanh, tránh uống cà phê và trà đen và đặc biệt là trong vài ngày đầu cai thuốc. Thói quen này có thể giúp bạn thải nicotine ra ngoài nhanh hơn. Ăn nhiều trái cây tươi và rau quả có thể giúp bạn cải thiện được tiêu hóa và sức khỏe tổng thể và chống lại cơn thèm thuốc lá.

1.8. Tìm kiếm một hệ thống hỗ trợ để bỏ hút thuốc
Kết nối với bạn bè và gia đình có thể giúp bạn duy trì động lực và hỗ trợ cai thuốc lá. Tham gia các hoạt động với bạn bè và gia đình có thể giúp đánh lạc hướng cơn thèm thuốc và chúng ta cũng có thể cân nhắc tham khảo một nhà trị liệu chuyên nghiệp để giúp ức chế cảm giác thèm thuốc và kiểm soát được căng thẳng.

2. 13 mẹo cai thuốc lá tốt nhất từ ​​trước đến nay
2.1. Tìm động lực giúp cai thuốc lá nhanh nhất
Hãy luôn tìm động lực cho bản thân. Mẹo cai thuốc lá tốt nhất đó chính là luôn có động lực để thực hiện.

Để có thể thành công trong 1 việc gì đó thì điều tiên đó là bạn phải có mục tiêu và động lực khát khao cho bản thân. Nếu như hành động mà không có động lực thì sẽ không bao giờ thành công chỉ có đứt quãng giữa đường.

Vậy nên trước khi hành động hút thuốc luôn nghĩ những lợi ích, động lực như: giảm khả năng bị ung thư, giảm các bệnh về tim mạch cải thiện sức khỏe tốt hơn. Ngoài ra còn nghĩ đến gia đình: bỏ thuốc có thể bảo vệ gia đình khỏi những tác hại của khói thuốc lá thụ động.

Để có động lực, bạn cần có một lý do cá nhân và mạnh mẽ để sử dụng các mẹo cai thuốc lá hiệu quả nhất. Nó có thể là để bảo vệ gia đình bạn tránh khỏi khói thuốc. Hoặc giảm nguy cơ mắc bệnh ung thư phổi, bệnh tim hoặc các bệnh khác. Hoặc để trông và cảm thấy trẻ hơn. Chính vì thế mỗi khi muốn bỏ cuộc hãy luôn nhìn về gia đình và nhìn về lý do mà bạn bắt đầu để lấy thêm động lực chiến đấu.

2.2. Chuẩn bị kế hoạch khoa học để bỏ thuốc đột ngột
Một bí quyết bỏ thuốc hiệu quả vô cùng quan trọng chính là bạn nên tìm hiểu kỹ các vấn đề trước và sau khi hành động, tìm hiểu những khó khăn sẽ gặp phải trong giai đoạn đầu để có những biện pháp tốt nhất, sau đó quyết định thời gian để bỏ thuốc lá 1 cách đột ngột nhanh chóng.

Bỏ thuốc đột ngột nhưng vẫn cần phải đưa ra kế hoạch cụ thể chi tiết 1 cách khoa học giúp cho quá trình cai thuốc lá thật đơn giản và hiệu quả nhất. Ví dụ như: Hôm nay hút nhiêu điếu hoặc ngày mai phải hút ít hơn như thế nào, đặt ra những khung giờ nào mới được sử dụng thuốc.

Hãy nghiêm khắc với bản thân với những kế hoạch và những mục tiêu đặt ra một cách kỷ luật, luôn có thưởng khi hoàn thành, sẽ phạt khi phạm lỗi.

2.3. Cân nhắc Liệu pháp Thay thế Nicotine
Khi bạn bỏ hút thuốc, việc cai nicotine có thể khiến bạn đau đầu, ảnh hưởng đến tâm trạng hoặc làm tiêu hao năng lượng của bạn. Thèm “chỉ một cú kéo” thật khó. Liệu pháp thay thế nicotine có thể hạn chế những thôi thúc này. Các nghiên cứu cho thấy kẹo cao su nicotine, viên ngậm và miếng dán cải thiện cơ hội thành công của bạn khi bạn cũng đang tham gia chương trình cai thuốc lá.

2.4. Tìm hiểu về Thuốc theo toa
Thuốc có thể hạn chế cảm giác thèm ăn và cũng có thể khiến việc hút thuốc trở nên kém thỏa mãn hơn nếu bạn cầm một điếu thuốc. Các loại thuốc khác có thể làm dịu các triệu chứng cai nghiện, chẳng hạn nhưtrầm cảm hoặc các vấn đề về khả năng tập trung.
2.5. Sự trợ giúp từ người thân
Người thân vừa là 1 động lực to lớn cũng vừa là một người bạn đồng hành cùng bạn trên chặng đường gian nan khó khăn.

Hãy nhờ bạn bè, gia đình và những người cùng chí hướng để luôn nhắc nhở, quan tâm và chú ý kỷ luật khi bạn phạm lỗi nhằm giúp bạn kiểm soát được những kế hoạch và mục tiêu đã đặt ra.

Ngoài ra, bạn có cũng có thể tìm và tham gia vào nhóm hỗ trợ hay tìm người cố vấn và người giúp đỡ lên dây cót tinh thần cho bạn mỗi khi khó khăn.

Nói với bạn bè, gia đình và những người khác mà bạn thân thiết rằng bạn đang cố gắng bỏ thuốc lá. Họ có thể khuyến khích và cho bạn một vài mẹo cai thuốc lá, đặc biệt là khi bạn muốn hút thuốc trở lại. Bạn cũng có thể tham gia một nhóm hỗ trợ hoặc có thể nói chuyện với một cố vấn. Liệu pháp hành vi là một hình thức tư vấn giúp bạn xác định và tuân thủ các chiến lược bỏ thuốc lá.

2.6. Hãy cho bản thân một khoảng thời gian nghỉ ngơi
Bản thân thư giãn là cách bỏ thuốc lá tốt. Để tăng tỉ lệ thành công bạn luôn phải để cơ thể trong trạng thái thư giãn.

Lý do đa số chúng ta tìm đến điếu thuốc có phải là bạn đang căng thẳng, mệt mỏi bạn muốn tìm đến sự sảng khoái và thư giãn tinh thần thoải mái. Và thuốc lá chính là giải pháp nhanh và hiệu quả nhất.

Để giảm hút thuốc thì chúng ta phải để tâm trạng và cơ thể luôn trong trạng thái thư giãn, nghỉ ngơi bằng cách tập thể dục, nghe những bản nhạc yêu thích, hay gặp hội bạn đang có ý tưởng giống mình.

Hạn chế gặp phải những tình huống làm căng thẳng trong vài tuần chính là phương pháp giúp cho bạn giảm và cai thuốc lá nhanh nhất.

Một lý do khiến cho mọi người hút thuốc là nicotine giúp họ thư giãn. Sau khi thoát khỏi, bạn sẽ cần những cách mới để thư giãn. Có rất nhiều lựa chọn. Bạn có thể tập thể dục để xả hơi, điều chỉnh bản nhạc yêu thích, kết nối với bạn bè, mát-xa cho bản thân hoặc dành thời gian cho một sở thích. Hãy cố gắng tránh những tình huống căng thẳng trong vài tuần đầu tiên sau khi bạn ngừng hút thuốc.

2.7. Tránh rượu và các tác nhân khác
Đồ uống có cồn đây sẽ là nguyên nhân chính làm cho công cuộc cai thuốc của bạn phá sản vì khi dùng đồ uống có cồn sẽ kích thích não, kích thích thói quen của bạn, không những vậy khi trên bàn có người hút thuốc cũng sẽ kích thích não bộ bạn nhớ tới điếu thuốc.Cà phê cũng là thứ phải thay đổi ở trong khẩu vị khi trong quá trình cai thuốc lá.Có phải khi uống cà phê chúng ta sẽ luôn cần thêm điếu thuốc lá vi vu phải không. Vì thế hãy chuyển cà phê qua dùng trà xanh trong vài tuần để giúp tăng khả năng thành công khi bỏ thuốc lá.Sau bữa ăn chúng ta thường hút thuốc đây là điều mà hết 90% anh em mắc phải, hãy đứng lên đi dạo, rửa chén cho vợ, nhai kẹo cao su là cách bỏ thuốc lá đơn giản nhất.Khi bạn uống rượu, bạn sẽ khó đạt được mục tiêu là không hút thuốc hơn. Vì thế, hãy cố gắng hạn chế rượu bia khi mới cai. Tương tự như thế, nếu bạn thường hút thuốc khi uống cà phê, hãy chuyển sang uống trà trong vài tuần. Nếu bạn thường hút thuốc sau bữa ăn, hãy tìm việc khác để làm thay vào đó, chẳng hạn như đánh răng, đi dạo, nhắn tin cho bạn bè hoặc nhai kẹo cao su.

2.8. Khử mùi thuốc lá tại nhà
Khi đã quyết tâm thực hiện mẹo cai thuốc lá hiệu quả thì trong nhà bạn cũng nên cất hết những vật dụng liên quan, có mùi, giặt sạch những quần áo và giặt sạch mọi thứ như thảm, rèm, vải bọc để không bị mùi thuốc lá kích thích đến bạn.Nếu như bạn thường có thói quen hút thuốc trong xe thì cũng phải vệ sinh, làm sạch và sử dụng các chất tạo mùi, làm mát để khử mùi thuốc lá. Hãy đảm bảo rằng là bạn sẽ không ngửi thấy được mùi thuốc tại những nơi quen thuộc như nhà, xe hơi để tránh bị kích thích gây khó chịu.Khi bạn đã hút điếu thuốc cuối cùng, hãy quăng tất cả gạt tàn và bật lửa của bạn. Giặt bất kỳ quần áo nào có mùi khói, và làm sạch thảm, rèm và ghế bọc của bạn. Sử dụng chất làm mát không khí để giúp thoát khỏi mùi hương quen thuộc đó. Nếu bạn hút thuốc trong ô tô thì hãy làm sạch nó. Bạn không muốn nhìn thấy hoặc ngửi thấy bất cứ thứ gì khiến cho bạn nhớ đến việc hút thuốc.
2.9. Kiên trì
Bạn đã biết bỏ thuốc là 1 vấn đề khó khăn, gian nan đâu phải ai muốn bỏ là bỏ được, vì thế điều cần là bạn phải có sự kiên trì, không được nản vì thất bại mà cần phải đứng lên làm lại.

Để thành công trong 1 việc gì đó thì bạn cũng phải trải qua nhiều lần thất bại để có thể đúc kết được kinh nghiệm cho những lần thẳng bước tiếp theo. Vì thế đừng vì vài lần thất bại mà cảm nhận rằng mình không thể tiếp tục và cảm thấy chán nản mà từ bỏ, luôn kiên trì thành công sẽ tới với bạn.

2.10. Phương pháp tập thể dục giúp bỏ thuốc lá hiệu quả!
Theo nghiên cứu khi bạn tập thể dục có thể khiến bạn kiềm chế được cơn thèm nicotine, thèm thuốc của cơ thể, đây được xem là phương pháp vừa tốt cho sức khoẻ vừa cai thuốc lá nhanh và lại hiệu quả nhất.

Vì thế khi bạn đang thèm thuốc lá hãy xỏ giày vào chạy hay đứng lên đi bộ hoạt động gân cốt vài vòng thì sẽ rất có ích trong việc cai nicotine.

Hoạt động tích cực có thể hạn chế được cảm giác thèm nicotine và giảm bớt một số triệu chứng cai nghiện. Thay vào đó, khi bạn muốn với một điếu thuốc, hãy đi giày và chạy bộ. Ngay cả những bài tập thể dục nhẹ cũng có ích như dắt chó đi dạo hoặc nhổ cỏ trong vườn. Lượng calo bạn đốt cháy cũng sẽ ngăn ngừa việc tăng cân khi bạn bỏ thuốc lá.

2.11. Ăn trái cây và rau
Theo như nghiên cứu trên Thế Giới thì trái cây và rau quả chính là thực phẩm giúp hỗ trợ bỏ thuốc tương đối hiệu quả. Người ăn nhiều trái cây và rau quả thì sẽ có khả năng thành công cao gấp 3 lần so với người bình thường.

Bời vì trong 1 số thực phẩm sẽ làm ảnh hưởng đến việc sản xuất nước bọt trong cơ quan miệng, có tác dụng làm thay đổi nhận biết mùi của thuốc. Điều này giúp bạn giảm cảm giác thèm thuốc và làm mất đi vị ngon của thuốc.

Ngoài ra, trong trái cây, rau quả còn mang đến cho chúng ta những dưỡng chất tốt như Vitamin các loại, Omega 3, giúp ta giảm Stress, giải độc, giảm đói vừa tốt cho sức khoẻ vừa giúp cho cơ thể bạn tránh được những tác dụng phụ khi cai thuốc.

Bạn đừng cố gắng ăn kiêng khi bỏ thuốc lá. Thay vào đó, bạn hãy giữ mọi thứ đơn giản và cố gắng ăn nhiều trái cây, rau, ngũ cốc và protein nạc. Những thứ này rất tốt sức khỏe của bạn.

2.12. Nghĩ tới những phần thưởng khi thành công
Phần thưởng đầu tiên và lớn nhất chính là sức khoẻ của chúng ta được cải thiện tốt lên từng ngày, không phải lo lắng về những căn bệnh ung thư hay đột quỵ bất ngờ nữa.

Tiếp theo đó chính là tiết kiệm được số tiền tuy không quá lớn nhưng cũng không quá nhỏ từ việc mua thuốc.

Và cuối cùng đó là bạn sẽ có nhiều thời gian gần gũi bên gia đình và các con của mình mà không sợ bị ám mùi hôi hay gây hại đến sức khoẻ các thành viên trong gia đình của mình khi không phải hút thuốc thụ động.

Phần thưởng lớn nhất mang lại chính là niềm vui và hạnh phúc gia đình khi anh em có thể bỏ được thuốc lá.

2.13. Hãy nhớ rằng thời gian ở bên bạn
Ngay sau khi bạn bỏ thuốc lá, bạn sẽ bắt đầu nhận được những lợi ích sức khỏe ngay lập tức. Chỉ sau 20 phút, nhịp tim của bạn sẽ trở lại bình thường. Trong vòng một ngày, mức carbon monoxide trong máu của bạn cũng sẽ giảm trở lại vị trí cũ. Chỉ trong vòng 2 đến 3 tuần, bạn sẽ bắt đầu giảm khả năng bị đau tim. Về lâu dài, bạn cũng sẽ giảm nguy cơ mắc ung thư phổi và những bệnh ung thư khác.

Sử dụng thuốc hỗ trợ để cai thuốc lá

Các loại thuốc có thể giúp cho bạn giảm cảm giác thèm thuốc, chúng chỉ nên được sử dụng khi có sự đồng ý và hướng dẫn từ bác sĩ. Phương pháp này được xem là cách bỏ thuốc lá nhanh và hiệu quả nhất.

Liệu pháp thay thế nicotine được kể đến như kẹo cai thuốc lá, miếng dán nicotine, viên ngậm bỏ thuốc lá và thuốc hít hay xịt mũi. Các sản phẩm này sẽ giúp cho bạn tiếp nạp lượng nicotine vừa đủ mà không có thêm các hoá chất độc hại và khí độc như trong thuốc lá. Sản phẩm giúp bạn giải quyết được phần nào vấn đề về nghiện tâm lý.
`,
  2: `Để việc cai thuốc lá được hiệu quả và dễ dàng hơn, bạn có thể thực hiện một số biện pháp hỗ trợ như tư vấn điều trị nhận thức chuyển đổi hành vi hướng dẫn người cai thuốc lá, thực hiện các kế hoạch để giải quyết những tình huống khó khăn, khó chịu khi cai thuốc; sử dụng thuốc hỗ trợ cai thuốc lá... Bên cạnh đó, bạn có thể thực hiện từ từ những hoạt động dưới đây để giúp bản thân nhanh chóng từ bỏ được thuốc lá:
Lên kế hoạch: Bạn cần lên kế hoạch cụ thể, xác định rõ tư tưởng cai thuốc lá không hề dễ dàng. Người cai nên có kế hoạch rõ ràng, thực hiện từng bước để cảm nhận được hiệu quả.

Cắt giảm dần số lượng thuốc lá: Bỏ thuốc lá ngay lập tức rất khó, thường gây những khó chịu ban đầu như mất tập trung, cáu gắt, khó chịu... Bạn nên giảm dần số lượng thuốc mỗi ngày, giảm từ từ đến khi không còn hút nữa.

Tập thể dục điều độ: Giúp cơ thể tăng cơ bắp, oxy đến các bộ phận bằng cách tập thể dục là một ý kiến rất khôn ngoan. Thể thao cũng giúp đánh lạc hướng tâm trí của bạn khỏi thói quen hút thuốc.

Không uống rượu và các loại nước có ga: Đừng để bản thân chìm vào những chất kích thích khác khi bạn muốn từ bỏ thuốc lá. Uống rượu bia cũng gây tác động xấu đến cơ thể và không giúp ích được nhiều cho quá trình cai thuốc. Việc uống nước có ga cũng khiến bạn thèm thuốc lá hơn, vậy nên hãy uống nước lọc để giúp cai thuốc lá hiệu quả.

Học cách kiểm soát căng thẳng: Khi mệt mỏi, hãy thử xoa dịu tâm trí bằng những cách giải trí khác nhau như nghe nhạc, xem phim, nấu ăn hoặc ca hát... Tất cả sẽ giúp bạn quên đi thuốc lá và bớt căng thẳng, hạn chế thói quen hút thuốc khi strees.

Ăn uống lành mạnh: Một chế độ ăn uống lành mạnh sẽ giúp duy trì sức khỏe và kiểm soát cơn thèm thuốc tốt hơn. Ăn nhiều cà rốt, cần tây, sữa sẽ giúp cơ thể được thanh lọc nhanh hơn, khử được mùi thuốc trên lưỡi và góp phần làm sạch phổi.

Cam: Những loại trái cây họ cam, quýt giúp bạn bỏ thuốc lá dễ dàng, đồng thời tăng cường sức khỏe. Trong quả cam chứa nhiều vitamin C giúp trị khô và thâm môi do hút thuốc lá. Ngoài ra, quế cũng là loại dược liệu giúp bạn kiểm soát cơn thèm thuốc lá hiệu quả.

Ăn mặn, ăn trái cây khô: Trong những ngày bỏ thuốc, bạn nên ăn mặn hơn một chút. Nếu bạn cảm thấy thèm thuốc, hãy rắc ít muối lên lưỡi, sẽ thấy hiệu quả ngay tức khắc! Ngoài ra, người bỏ thuốc lá nên ăn những loại trái cây khô có mùi thơm để lấn át cơn thèm.

Chơi với người không hút thuốc: Thường xuyên đi chơi với bạn bè hút thuốc sẽ khiến cơn thèm thuốc của bạn trỗi dậy. Hãy kết thân với những người không hút thuốc và quyết tâm, đặt cược về chính mình, đồng thời tự thưởng cho mình sau mỗi giai đoạn bỏ thuốc lá thành công.

Nhai kẹo cao su không đường: Nhai kẹo cao su giúp bạn kiểm soát cơn thèm nicotine, tốt nhất là kẹo không đường.

Đánh răng đều đặn: Mùi vị của kem đánh răng có thể tạm thời ngăn cản cơn thèm thuốc lá của bạn. Ngoài ra, chải răng đều đặn giúp bạn loại bỏ mảng vàng do khói thuốc lá để lại trên răng.`,
  3: `Hút thuốc lá quá nhiều mang lại những nguy cơ nghiêm trọng tới sức khỏe. Ai cũng biết vậy nhưng việc hạn chế hoặc bỏ hẳn thuốc lá không hề dễ dàng. Tuy nhiên, với sự trợ giúp của một kế hoạch cai thuốc, có lẽ bạn sẽ dễ dàng vượt qua giai đoạn khó khăn này hơn. Dưới đây là một số ý tưởng giúp bạn lập kế hoạch cai thuốc lá chuẩn nhất.

1. Liệt kê lý do bạn muốn bỏ hút thuốc
Chỉ bạn mới là người có thể quyết định khi nào mình đã sẵn sàng bỏ thuốc lá. Do vậy bạn cần hiểu rõ tại sao mình lại đưa ra quyết định này và điều gì sẽ thúc đẩy mình cai thuốc lá.

Hãy lập danh sách các lý do bạn muốn bỏ thuốc, đây sẽ là những nền tảng quan trọng hỗ trợ kế hoạch cai thuốc của bạn. Lý do bỏ thuốc có thể bao gồm:

Cải thiện sức khỏe;
Giảm nguy cơ mắc bệnh trong tương lai;
Bảo vệ sức khỏe gia đình, bạn bè và người xung quanh;
Tiết kiệm chi phí.
2. Chọn ra một ngày không hút thuốc
Chọn một ngày cụ thể trong tháng tới để cai thuốc lá. Bạn có thể chọn một ngày ngẫu nhiên, một ngày ít căng thẳng, stress hơn hoặc một ngày có ý nghĩa với bạn, chẳng hạn như ngày sinh nhật hoặc ngày lễ. Hãy đánh dấu ngày này lên trên lịch.

Mặc dù nhiều người hút thuốc lá muốn giảm tần suất hút dần dần, nhưng bằng chứng khoa học cho thấy việc bỏ thuốc đột ngột - tức đặt ngày không hút thuốc và kiên trì thực hiện - sẽ có khả năng bỏ thuốc lâu dài cao hơn.

3. Chuẩn bị cho ngày không hút thuốc
Nghiên cứu đã chỉ ra rằng sự kết hợp giữa điều trị y tế và tư vấn hành vi sẽ giúp nâng cao khả năng cai thuốc lá thành công. Tuy nhiên những can thiệp này cần có thời gian và được lên kế hoạch từ trước. Bạn cũng cần thời gian để cân nhắc và chuẩn bị các phương án hỗ trợ, ví dụ như:


Hỏi bác sĩ về các loại phương pháp hỗ trợ cai thuốc lá: Ví dụ như dùng miếng dán nicotine (liệu pháp thay thế nicotine - NRT), viên ngậm, kẹo cao su, nước súc miệng, thuốc hít hoặc thuốc xịt mũi... Các phương pháp này sẽ được áp dụng vào ngày bỏ thuốc của bạn. Một số loại thuốc không chứa nicotine có thể làm giảm triệu chứng cai nicotine bằng cách bắt chước cách hoạt động của chất này trong cơ thể, ví dụ như Varenicline (Chantix). Thuốc này nên được sử dụng từ 1-2 tuần trước ngày bỏ thuốc của bạn;
Liệt kê các tác nhân và thói quen hút thuốc của bạn: Hãy lập danh sách các tác nhân phổ biến dẫn đến hút thuốc hoặc thói quen hút thuốc hàng ngày điển hình của bạn. Bạn có hút thuốc khi căng thẳng không? Bạn có luôn hút thuốc sau bữa ăn không? Bạn có hút thuốc sau khi tan làm không?... Việc xác định các mô thức thói quen này có thể giúp bạn xác định thời điểm cần hỗ trợ hoặc tự đánh lạc hướng bản thân bởi những tác nhân khác;
Nói chuyện với mọi người: Hãy nói cho gia đình, bạn bè và đồng nghiệp biết về ngày không hút thuốc lá của bạn. Điều này giúp bạn có thêm nhiều sự hỗ trợ về mặt tinh thần. Bạn có thể nhờ họ kiểm tra kết quả, cùng thiết lập các hoạt động để giúp bạn thoát khỏi tình trạng hút thuốc và kiên nhẫn với những thay đổi trong tâm trạng của bạn. Bạn cũng có thể yêu cầu những người bạn không hút thuốc xung quanh mình và cũng không mời bạn hút thuốc.
Dọn dẹp môi trường sống: Có lẽ bạn sẽ cần dành đôi chút thời gian để kiểm tra khắp nhà, xe hơi, văn phòng và những khu vực quen thuộc để loại bỏ những vật dụng dùng để hút thuốc (ví dụ: thuốc lá, bật lửa, diêm và gạt tàn). Giặt áo khoác và các loại quần áo khác có thể còn sót lại mùi thuốc lá. Làm sạch đồ nội thất bọc đệm hoặc rèm cửa.
Tích trữ các sản phẩm thay thế: Chuẩn bị sẵn những vật dụng mà bạn có thể thay thế cho điếu thuốc mà bạn thường ngậm trong miệng, chẳng hạn như kẹo cao su không đường, kẹo cứng, ống hút, que quê. Ngoài ra bạn cũng có thể tìm các vật dụng để giữ cho đôi tay mình bận rộn, đỡ trống trải, ví dụ như một quả bóng bóp. Hãy để những thứ này ở nơi bạn thường để thuốc lá hoặc gạt tàn;
Lên lịch làm sạch răng. Hãy thường xuyên đi khám răng định kỳ, lấy cao răng và chăm sóc răng thường xuyên để loại bỏ vết ố vàng do nicotine. Với hàm răng khỏe mạnh và trắng sáng có thể sẽ là động lực để giúp bạn quyết tâm cai thuốc lá.
Dành thời gian suy ngẫm về kế hoạch cai thuốc lá. Đặc biệt nếu bạn đã từng cố gắng trước đây nhưng lại thất bại, hãy tìm hiểu đâu là trở ngại khiến bạn chưa vượt qua. Hãy tự phân tích xem điều gì hiệu quả và điều gì không? Sau đó hãy điều chỉnh lại kế hoạch và làm khác đi lần này.
4. Vượt qua ngày không hút thuốc lá
Vượt qua một ngày bỏ thuốc lá có thể là một thử thách lớn về mặt tinh thần và thể chất, đặc biệt là khi những cơn thèm thuốc lá có thể xuất hiện bất cứ lúc nào. Hãy tham khảo một số mẹo dưới đây để giữ vững tinh thần trong ngày bỏ thuốc:

Không hút thuốc, dù chỉ là một điếu;
Áp dụng liệu pháp thay thế nicotine (NRT) nếu bạn đã chọn phương pháp đó;
Thường xuyên nhắc nhở bản thân về lý do cai thuốc lá;
Uống nhiều nước hoặc nước trái cây;
Duy trì hoạt động thể chất;
Tránh các đám đông hút thuốc và tránh những người gợi ý, mời bạn hút thuốc;
Tìm một nhóm cộng đồng, tư vấn hoặc lớp học hỗ trợ cai thuốc lá;
Thực hành các kỹ thuật quản lý căng thẳng và thư giãn;
Giữ cho đôi tay bận rộn với các sản phẩm thay thế thuốc lá hoặc làm các hoạt động thường xuyên như viết hoặc đan lát;
Giữ cho tâm trí không bị phân tâm khi cần thiết với một cuốn sách hoặc trò chơi ô chữ.
Nhìn chung, với một kế hoạch cai thuốc bài bản và có sự chuẩn bị kỹ lưỡng, bạn sẽ có những sự hỗ trợ cần thiết trong quá trình bỏ thuốc. Càng tập hợp được nhiều nguồn lực (các nhóm hỗ trợ, biện pháp thay thế nicotine, thuốc, lời khuyên của bác sĩ...) thì bạn càng có nhiều khả năng từ bỏ được thói quen hút thuốc của mình.

`,
  4: `Khói thuốc lá chứa 7.000 hóa chất, trong đó có 69 chất là tác nhân gây ung thư. Sử dụng thuốc lá là nguyên nhân của khoảng 25 căn bệnh, trong đó có nhiều bệnh nguy hiểm như: ung thư phổi, ung thư miệng, đột quỵ, nhồi máu cơ tim, bệnh phổi tắc nghẽn mạn tính,... Cai thuốc lá giúp bảo vệ sức khỏe cho bản thân, gia đình và cộng đồng. Dưới đây là một số bí quyết hy vọng sẽ giúp bạn phần nào trong quá trình cai nghiện thuốc lá. 
 
Lên kế hoạch bỏ thuốc và cam kết với bản thân: Lường trước những khó khăn của việc tự cai thuốc lá để từ bỏ thói quen xấu một cách hiệu quả. Lên một kế hoạch cụ thể ít nhất 6 tháng, nên chia cường độ giảm dần sử dụng thuốc từng tháng để cơ thể dễ dàng thích nghi. Ghi nhớ kế hoạch và kiên định với kế hoạch.
 
Cắt giảm thuốc lá: Bỏ ngay tức khắc thói quen hút thuốc là điều rất khó thực hiện. Bạn cần giảm số lượng thuốc hút trong ngày và quyết tâm giảm dần đến khi mỗi ngày không hút điếu nào cả.
 
Sử dụng cần tây: Được biết đến là loại rau rất tốt cho sức khoẻ và có hiệu quả tốt khi được dùng để cai thuốc lá. Ngoài ra, trong nhóm rau, củ, quả tốt cho người cai thuốc lá còn có cả cà tím, các loại đậu, các loại rau và cả dưa chuột cũng góp phần làm giảm cơn thèm thuốc.
 
Không uống rượu, nước có ga: Nhiều đàn ông thường sa vào nghiện rượu khi bỏ thuốc lá, đây là thói quen xấu không kém thuốc lá, ảnh hưởng đến sức khỏe. Theo các nghiên cứu, thức uống có ga khiến bạn thèm thuốc lá hơn. Vì thế, thay vì uống các loại nước có ga như coca, soda, hãy uống thật nhiều nước lọc.
 
Ăn cam: Những loại trái cây họ cam, quýt giúp bạn bỏ thuốc lá dễ dàng, đồng thời tăng cường sức khỏe. Trong quả cam chứa nhiều vitamin C giúp trị khô và thâm môi do hút thuốc lá. Ngoài ra, quế cũng là loại dược liệu giúp bạn kiểm soát cơn thèm thuốc lá hiệu quả.
 
Ăn mặn, ăn trái cây khô: Trong những ngày cai nghiện thuốc lá, bạn nên ăn mặn hơn một chút. Nếu bạn cảm thấy thèm thuốc, hãy rắc ít muối lên lưỡi, sẽ thấy hiệu quả ngay tức khắc. Ngoài ra, người bỏ thuốc lá nên ăn những loại trái cây khô có mùi thơm để lấn át cơn thèm.
 
Kiểm soát căng thẳng: Thông thường, đàn ông hay hút thuốc mỗi khi căng thẳng. Thay vào đó, mỗi khi thấy mệt mỏi, bạn nên nghe nhạc, chơi thể thao hay xem chương trình truyền hình yêu thích để cơ thể quên đi thuốc lá.
 
Hạn chế tiếp xúc với những người hút thuốc: Thường xuyên đi chơi với bạn bè hút thuốc sẽ khiến cơn thèm thuốc của bạn trỗi dậy. Hãy kết thân với những người không hút thuốc và quyết tâm, đặt cược về chính mình, đồng thời tự thưởng cho mình sau mỗi giai đoạn bỏ thuốc lá thành công./.`,
  5: `Theo các bác sĩ, nghiện thuốc lá được xác định là bệnh, nằm trong nhóm bệnh rối loạn tâm thần và hành vi do dùng chất hướng thần.
Mặc dù đã phòng chống tác hại thuốc lá bền bỉ trong hơn 10 năm qua, Việt Nam vẫn nằm trong nhóm quốc gia có tỉ lệ người hút thuốc lá cao nhất thế giới (38,9% ở nam giới trưởng thành, cả hai giới là trên 20% năm 2023).

Hiện nhiều nơi quảng bá thuốc lá điện tử như một công cụ hỗ trợ cai nghiện dưới vỏ bọc góp phần kiểm soát việc hút thuốc lá.

Các sản phẩm thuốc lá được thiết kế bắt mắt, đa dạng từ màu sắc đến hình ảnh và với hơn 15.000 hương vị hấp dẫn.

Thực tế tất cả các loại thuốc lá đều độc hại, bao gồm cả thuốc lá điện tử và thuốc lá nung nóng đều chứa nicotine.

Đây là chất gây nghiện cao, gây hại đến sức khỏe, đặc biệt là sự phát triển não bộ ở trẻ em và thanh thiếu niên.
ThS.BS Đinh Thị Hải Yến - Trung tâm Kiểm soát bệnh tật TP.HCM - cho biết chất nicotine có trong thuốc lá rất dễ gây nghiện và tạo ra sự phụ thuộc.

Khi đã rơi vào trạng thái nghiện, người hút đang lệ thuộc vào chất nicotine, chất này sẽ tác động vào não bộ gây cảm giác hưng phấn, sảng khoái, cảm giác giảm căng thẳng, mệt mỏi, tỉnh táo… 

Khi nicotine não bộ đã quen với hàm lượng hằng ngày, không có sẽ dẫn đến cảm giác khó chịu, rất khó bỏ.

ThS.BS Nguyễn Hữu Hoàng - chuyên khoa hô hấp, giảng viên Trường đại học Y Dược TP.HCM - chia sẻ nghiện thuốc lá được định nghĩa là sự lệ thuộc về mặt thể chất và tâm thần đối với nicotine có trong thuốc lá. Tùy vào mức độ nghiện khác nhau mà mỗi người sẽ có biểu hiện cũng như thói quen hút thuốc lá khác nhau.

Nghiện thuốc lá được xác định là bệnh, nằm trong nhóm bệnh rối loạn tâm thần và hành vi do dùng chất hướng thần.

Từ lúc một người bắt đầu tiếp xúc với khói thuốc lá lần đầu thì phải mất hơn 2 năm người đó mới nghiện hoàn toàn cả về thực thể, tư tưởng và hành vi. Đó là một quá trình dài của sự tiếp nhận một thói quen cũng như là hành vi mới.

Theo bác sĩ Hoàng, cai nghiện thuốc lá có thể nói dễ mà cũng có thể nói khó. Tùy thuộc vào đối tượng khác nhau thì việc cai nghiện thuốc lá sẽ dễ hay khó.

Để cai nghiện thuốc lá dễ dàng, chính người nghiện thuốc lá phải trưởng thành trong sự nhận thức về tác hại của thuốc lá. Họ phải là người chủ động trong việc muốn cai thuốc lá.

Muốn có được điều này thì công tác tuyên truyền và tư vấn ban đầu hết sức quan trọng. Nếu người nghiện hiểu rõ vấn đề này thì việc cai nghiện thuốc lá sẽ rất dễ dàng với sự hỗ trợ tích cực của bác sĩ và thuốc cai nghiện thuốc lá nếu cần.

Nếu người nghiện thuốc lá không nhận thấy việc hút thuốc lá là có hại và là chuyện bình thường thì rất khó để cai nghiện thuốc lá.

Đây là quá trình thay đổi nhận thức kéo dài, đòi hỏi sự kiên nhẫn của những người hỗ trợ xung quanh gồm gia đình, bạn bè và cả nhân viên y tế.

Bên cạnh đó, để có thể cai thuốc lá được thì người nghiện thuốc lá có thể tìm đến các bệnh viện để được hỗ trợ tư vấn cai nghiện thuốc lá.

Tại TP.HCM từ năm 2014, với sự hỗ trợ của Quỹ Phòng chống tác hại thuốc lá (VNTCF), Sở Y tế TP.HCM mở nhiều phòng tư vấn và điều trị cai nghiện thuốc lá.

Các đơn vị này nằm trải đều khắp như ở Bệnh viện quận 1, Bệnh viện TP Thủ Đức, Bệnh viện quận 11, Bệnh viện huyện Bình Chánh, Bệnh viện Phạm Ngọc Thạch, Bệnh viện Nhân dân Gia Định…`,
  6: `(BGĐT)- Nếu bạn đang tìm kiếm phương thức để từ bỏ thuốc lá thì một trong những cách đơn giản và dễ làm nhất là tập thể dục. Theo một nghiên cứu mới, tập thể dục có thể giúp ích cho việc cai thuốc lá giúp bạn dễ dàng đối phó với các triệu chứng khó chịu khi cai thuốc như: Khó ngủ, đau đầu, nhạt miệng, tăng cân...
Tập thể dục được biết là cách làm giảm các triệu chứng cai nghiện nicotine. Các nghiên cứu đã chỉ ra rằng thậm chí một bài tập thể dục ngắn trong 10 phút ngắn cũng có thể có những tác động tức thời trong việc làm giảm thèm muốn thuốc lá. Các bác sĩ khuyên bạn rằng, thay vì dành thời gian và tốn kém chi phí cho việc hút thuốc lá gây tổn hại sức khỏe, bạn hãy thường xuyên tập thể dục với các thiết bị tập thể dục tại nhà như máy chạy bộ điện, máy tập bụng, xe đạp tập thể dục… Bởi tập thể dục giúp tăng cường sức khỏe, sự dẻo dai của cơ thể, kích thích quá trình trao đổi chất, giúp bạn sống vui khỏe hơn, quá trình lão hóa cũng diễn ra chậm hơn.

Chuẩn bị cho bài tập thể dục trong liệu trình cai thuốc lá: Bạn không nên uống cà phê ở hàng vì ở đó có rất nhiều người hút thuốc, rất dễ kích thích sự thèm thuốc của bạn. Đồng thời cà phê là chất kích thích khiến bạn thèm thuốc nhiều hơn. Không nên để thuốc lá ở trong người, hãy đoạn tuyệt với nó vì đã cai thì không lý do gì để gói thuốc tồn tại ở trong bạn.

- Tập bài tập giúp cải thiện lưu thông máu, giảm mệt mỏi, giúp chống lại sự thôi thúc hút thuốc.

- Tập vận động toàn thân, giảm lo lắng, căng thẳng

- Tập thư giãn cơ thể, làm dịu hệ thần kinh, cân bằng thể chất

Song song với việc luyện tập thì nên sử dụng thực phẩm bổ trợ, đặc biệt là những sản phẩm có nguồn gốc thảo dược thiên nhiên, thường xuyên vệ sinh răng miệng để giảm thiểu mùi thuốc lá, tránh cảm giác thèm hút. Cần chăm chỉ tập luyện thể dục, thể thao, hạn chế bia rượu, cà phê, thức uống có ga, có thể nhai kẹo cao su trong quá trình cai thuốc lá. Sau khi cai thuốc lá thành công tuy không còn thèm thuốc nhưng việc hút thuốc như là một thói quen đã ăn sâu vào tiềm thức của mình. Nên bạn cần mạnh dạn khước từ các lời mời dùng thuốc lá để không bị tái nghiện.

Từ bỏ việc hút thuốc lá là mục tiêu của rất nhiều người. Không ít người đã cố gắng từ bỏ nhiều hơn một lần nhưng không thành công. Việc bỏ hẳn thuốc lá có thể mất một vài tuần hoặc lâu hơn, nhưng một khi từ bỏ thành công thì lợi ích sức khỏe bạn nhận được là hoàn toàn xứng đáng với cuộc đấu tranh khó khăn đó.`,
  7: `Sau hai tuần bỏ thuốc lá, huyết áp, nhịp tim ổn định, khứu giác và vị giác cải thiện, cảm giác hụt hơi khi leo cầu thang giảm.

Vị giác, khứu giác cải thiện

Nicotine cùng với các hóa chất khác trong khói thuốc lá gây hại cho vị giác và phản ứng thần kinh ở mũi. Sau hai tuần cai thuốc, bạn có thể bắt đầu nhận thấy khứu giác và vị giác tốt hơn. Người cai thuốc lá cũng cảm nhận hương vị thơm ngon của món ăn.

Với người hút thuốc lá lâu năm, mùi khói thuốc lá cũ vẫn bám trên quần áo, áo khoác, bên trong nhà. Gia đình có thể thuê dịch vụ dọn dẹp nhà cửa hoặc mang quần áo đến tiệm giặt để giặt sạch sâu.

Ổn định huyết áp và nhịp tim

Một tác dụng phụ có hại khác của nicotine là làm tăng nhịp tim và huyết áp cao. Những chức năng này bắt đầu trở lại bình thường nhanh sau khi một người bỏ thuốc lá.

Trong vòng 20 phút, nhịp tim trở lại trạng thái bình thường, huyết áp bắt đầu giảm vì các mạch máu không còn bị co lại bởi khói thuốc lá.

Trong vòng 12 giờ, mức oxy trong máu trở lại bình thường.

Trong vòng 24 giờ, nguy cơ đau tim bắt đầu giảm.

Thở dễ hơn

Trong vòng hai tuần đến hai tháng, người cai thuốc lá có thể đi bộ và thở dễ dàng hơn. Điều này là do chức năng phổi đang được cải thiện và các túi khí trong phổi bắt đầu giãn ra, sản xuất ít chất nhầy. Người cai thuốc dễ hít thở sâu hơn.

Chất độc được đào thải khỏi cơ thể

Sau khi không hút thuốc trong 24 giờ, nicotine sẽ được loại bỏ hoàn toàn khỏi máu. Vài ngày sau khi cai thuốc lá, nồng độ carbon monoxide (CO) trong máu tương đương với người không hút thuốc.

Carbon monoxide được tạo ra khi thuốc lá bị đốt cháy và người hút thuốc hít vào. Hút thuốc nhiều có thể dẫn đến ngộ độc CO. Các triệu chứng bao gồm thay đổi nhận thức, suy giảm chức năng vận động. Trong một số trường hợp, ngộ độc CO có thể gây tử vong.

Ít triệu chứng cai nghiện

Khoảng vài ngày sau khi bỏ thuốc, hầu hết mọi người cảm thấy buồn bực, cáu kỉnh, đau đầu dữ dội, thèm ăn khi cơ thể điều chỉnh lại. Một số người cũng gặp vấn đề về trí nhớ, khó tập trung, đau họng, khô miệng. Tuy nhiên đây chỉ là những cảm xúc nhất thời, giảm sau hai tuần.

Người cai thuốc lá nên tìm hiểu các phương pháp giảm căng thẳng mới, lành mạnh để giảm cảm giác thèm thuốc. Tập thể dục, thư giãn bằng cách massage, ngâm mình trong nước ấm, đọc sách, gặp gỡ bạn bè thân thiết... cũng giúp ích. Bỏ hút thuốc lá là quá trình khó khăn, đòi hỏi sự kiên trì.`,
  8: `Người đã bỏ thuốc lá nên tránh xa khói thuốc thụ động, ăn nhiều trái cây tươi và rau xanh, uống đủ nước, tập thể dục giúp cải thiện chức năng phổi.

Thuốc lá khi đốt cháy tạo ra hơn 7.000 chất hóa học, trong đó có ít nhất 69 loại có khả năng gây ung thư. Người hút thuốc lá hoặc hít phải khói thuốc thụ động thường xuyên dễ ho, khó thở, nguy cơ cao mắc nhiều bệnh hô hấp như viêm phế quản mạn tính, bệnh phổi tắc nghẽn mạn tính, các cơn hen phế quản cấp, ung thư phổi.

Thạc sĩ, bác sĩ Thân Thị Ngọc Lan, khoa Hô hấp, Bệnh viện Đa khoa Tâm Anh Hà Nội, cho biết mức độ ảnh hưởng của khói thuốc lá trên phổi phụ thuộc vào lượng thuốc hút, thời gian hút, tính cảm nhiễm với khói thuốc. Những tổn thương ở phổi do khói thuốc có thể không phục hồi hoàn toàn. Tuy nhiên, cơ quan này có khả năng tự chữa lành, làm sạch khi không còn tiếp xúc với khói thuốc.

Theo Healthline, sau 12 giờ không hút thuốc, phổi tự đào thải lượng khí carbon monoxide thừa, làm tăng mức oxy của cơ thể. Sau một tháng, chức năng phổi bắt đầu cải thiện. Sau 9 tháng, cấu trúc lông mao trong phổi bị tổn thương do khói thuốc có thể tự lành. Khoảng 10 năm, nguy cơ ung thư phổi và tử vong vì căn bệnh này giảm gần một nửa so với người tiếp tục hút thuốc.

Chủ động thay đổi lối sống, chế độ dinh dưỡng và cường độ vận động giúp đẩy nhanh quá trình cải thiện sức khỏe của phổi, tăng dung tích phổi sau khi bỏ thuốc lá. Dưới đây là một số cách.

Theo Hiệp hội Ung thư Mỹ, tập thể dục là cách quan trọng nhất để khắc phục ảnh hưởng tiêu cực của hút thuốc. Hoạt động thể thao giúp tăng lưu thông máu, tăng trao đổi khí. Những cử động, di chuyển của các cơ trong cơ thể làm tăng nhu cầu oxy, kích thích phổi hoạt động mạnh hơn để cung cấp oxy và loại bỏ CO2.

Duy trì thói quen này thường xuyên, hoạt động của túi khí trong phổi và khả năng hít vào nhiều không khí hơn, góp phần tăng dung tích phổi. Nhờ đó máu giàu oxy và chất dinh dưỡng tiếp cận tới những khu vực trước đây bị hạn chế do tác động thu hẹp mạch máu của thuốc lá.
Nên bắt đầu bằng các hoạt động thể chất nhẹ nhàng, sau đó tăng dần theo thời gian. Để đạt hiệu quả tốt nhất, duy trì ít nhất 30 phút mỗi ngày, 5 lần mỗi tuần. Chọn những địa điểm tập luyện có không khí trong lành, tránh nơi có mật độ giao thông cao.

Theo bác sĩ Lan, khi mới bắt đầu, một số người có thể cảm nhận có nhiều đờm trong phổi hoặc ho nhiều hơn, có thể xảy ra tạm thời sau khi ngừng hút thuốc. Đây là cách phổi tự làm sạch và loại bỏ các chất độc hại.

Tránh xa khói thuốc thụ động để tránh bị cám dỗ hút thuốc trở lại và bảo vệ phổi khỏi tác động của khói thuốc. Khi hít phải khói thuốc thụ động, phế nang cũng mất tính đàn hồi, dung tích phổi thu hẹp, cản trở sự di chuyển của không khí trong đường hô hấp. Nicotin trong khói thuốc cũng làm chậm sự chuyển động của lông mao, khiến chất nhầy và chất độc tích tụ tại phổi, gây tắc nghẽn.

Tăng cường bổ sung rau xanh, trái cây tươi chứa nhiều vitamin C giúp chống viêm, ngăn ngừa tổn thương tế bào. Điều này cũng trung hòa các gốc tự do mà cơ thể sản sinh ra khi tiếp xúc với chất độc hại như khói thuốc lá, nhờ đó có thể phục hồi tổn thương phổi.

Một số loại rau họ cải như bông cải xanh, súp lơ trắng, bắp cải, cải xoăn... góp phần chữa lành phổi. Mầm bông cải xanh và các loại rau họ cải khác còn chứa hợp chất sulphoraphane, hỗ trợ hệ miễn dịch loại bỏ vi khuẩn có hại khỏi hệ hô hấp, bảo vệ và chữa lành phổi.

Uống đủ nước mỗi ngày làm tăng lưu thông máu, làm loãng dịch nhầy, kích thích hoạt động của hệ thống lông mao, loại bỏ độc tố ra khỏi cơ quan này. Người trưởng thành khỏe mạnh nên uống khoảng 8 cốc nước (mỗi cốc 237 ml) mỗi ngày. Ưu tiên uống nước ấm thay vì nước đá lạnh. Theo Trung tâm Y tế Đại học Maryland (Mỹ), nước trà xanh chứa chất chống oxy hóa có thể sửa chữa những tổn thương do các gốc tự do trong khói thuốc lá gây ra.

Luyện hít thở sâu khoảng 5-10 phút mỗi ngày có thể giải tỏa căng thẳng, tránh cảm giác thèm hút thuốc. Các bài tập hít thở chủ động như thở chúm môi, thở bằng cơ hoành thúc đẩy quá trình trao đổi khí hiệu quả, cải thiện hoạt động của phổi.`,
  9: `Trái cây, rau, trà xanh, sữa giúp giảm cảm giác thèm hút thuốc, trong khi cà phê, rượu bia, đồ ngọt có thể khiến nỗ lực này thất bại.

Theo Tổ chức Y tế Thế giới (WHO), thuốc lá là một trong những mối đe dọa lớn nhất đối với sức khỏe cộng đồng trên thế giới. Hút thuốc đi kèm với một loạt các vấn đề, ảnh hưởng đến nhiều bộ phận khác nhau của cơ thể như tim, hormone, quá trình trao đổi chất và não.

Thống kê từ WHO, mỗi năm có khoảng 7 triệu ca tử vong trực tiếp liên quan đến hút thuốc và khoảng 1,3 triệu ca ở người không hút thuốc và tiếp xúc với khói thuốc thụ động.

Bỏ hút thuốc thường không dễ dàng nhưng chú trọng chế độ ăn uống có thể hỗ trợ bạn đạt được mục tiêu này. Dưới đây là thực phẩm nên ăn và tránh khi cai thuốc lá.

Thực phẩm nên ăn

Thực phẩm giàu vitamin C: Trái cây họ cam, dâu tây và ớt chuông có thể giảm cảm giác thèm nicotine - hóa chất có trong thuốc lá. Vitamin C còn tăng cường hệ thống miễn dịch có thể đã suy yếu do hút thuốc và loại bỏ nicotine ra khỏi cơ thể hiệu quả hơn.

Sữa và sản phẩm từ sữa: Sữa, kem, bơ, sữa chua và phô mai chứa casein có tác dụng giảm cảm giác thèm nicotin. Nhờ đó, người hút thuốc có thể cai nghiện dễ dàng hơn.

Trà xanh: Đây là một trong những thức uống giúp cai thuốc lá. Chúng rất giàu chất chống oxy hóa và chứa epigallocatechin gallate (EGCG) góp phần giảm cơn thèm nicotin và các triệu chứng như thèm hút thuốc, bồn chồn, khó ngủ...
Kẹo cao su: Nhai kẹo cao su có thể giúp người cai thuốc phần nào quên đi cơn thèm thuốc và giảm mùi hôi miệng do thuốc lá. Ưu tiên chọn kẹo cao su không đường để tránh nạp thêm lượng calo không cần thiết, tránh ảnh hưởng đến răng miệng.

Trái cây và rau: Ăn vặt bằng trái cây và rau cung cấp vitamin, khoáng chất và chất xơ hỗ trợ sức khỏe tổng thể. Trái cây mang lại vị ngọt tự nhiên, là lựa chọn lành mạnh mỗi khi thèm hút thuốc.

Thực phẩm nên hạn chế

Thịt: Các loại thịt, nhất là thịt chế biến sẵn, có thể chứa các hợp chất làm tăng cảm giác thèm nicotine. Nếu không tránh thực phẩm này, nỗ lực cai thuốc lá có thể thất bại.

Thực phẩm có đường: Đồ ngọt khiến lượng đường trong máu biến động, gây ra cảm giác thèm ăn, thèm thuốc và thay đổi tâm trạng. Tránh những thực phẩm này và tập trung vào chế độ ăn uống cân bằng nhiều trái cây, rau, ngũ cốc nguyên hạt và protein nạc để cai thuốc tốt hơn.

Cà phê: Nhiều người thường uống cà phê kèm hút thuốc. Hai thói quen này có thể liên kết về mặt tâm lý và gần như không thể tách rời. Caffeine còn mang lại cảm giác hưng phấn hơn cho tác dụng kích thích của thuốc lá. Đây là lý do khiến cà phê có thể làm tăng cảm giác thèm thuốc mạnh mẽ. Thay cà phê bằng trà thảo mộc trong một hoặc hai tuần để dần loại bỏ thói quen xấu này.

Rượu, bia: Tương tự cà phê, hút thuốc lá khi uống bia, rượu hoặc đồ uống chứa cồn là thói quen khó bỏ của một số người. Người đang cai thuốc nên kiêng rượu bia trong tháng đầu tiên. Sau đó, đặt ra giới hạn ở mức hai ly hoặc ít hơn mỗi ngày khi đã bỏ hẳn hút thuốc.`,
  10: `SKĐS - Các nhà khoa học của hai trường đại học Harvard (Mỹ) và Erasmus (Hà Lan) đã thực hiện một nghiên cứu dựa trên 2.700 người có dấu hiệu mắc bệnh tim, mạch vành.
Các nhà khoa học của hai trường đại học Harvard (Mỹ) và Erasmus (Hà Lan) đã thực hiện một nghiên cứu dựa trên 2.700 người có dấu hiệu mắc bệnh tim, mạch vành. Kết quả khảo sát cho thấy, những người tập yoga đều đặn sau 3 tháng đã giảm được khoảng gần 2,5kg, giảm lượng cholesterol và giảm cả áp lực máu. Thậm chí, khi đối chiếu với những người uống thuốc thường xuyên, kết quả còn cho thấy những người tập luyện yoga còn giảm được huyết áp nhiều hơn gấp ba lần. Điều thú vị là, tập yoga có thể xóa bỏ tất cả những yếu tố có hại này của cơ thể.

GS. Myriam Hunink của Đại học Harvard nói: “Môn thể thao được xem là thích hợp nhất dành cho người mắc bệnh béo phì lẫn bệnh tim là đạp xe. Giờ đây,  yoga cũng có hiệu quả hoàn toàn tương đương và lại tiện dụng hơn những môn thể thao khác nhiều vì nó dành cho mọi đối tượng”.

Cũng trong nghiên cứu này, các nhà khoa học còn phát hiện ra rằng, những người tập luyện yoga cũng dễ dàng bỏ thuốc lá hơn ngay sau đó nếu họ luyện tập yoga đền đặn. Dù chưa thể giải thích điều này nhưng các nhà nghiên cứu cũng lý giải rằng, yoga là sự kết hợp giữa việc điều hòa hơi thở, dẫn ôxy vào cơ thể và giảm stress. Tất cả những yếu tố này đều đối nghịch với việc hút thuốc nên yoga cũng trở thành một trong những cách thức cai thuốc lá hiệu quả.`,
  11: `Các chiến dịch truyền thông nhiều năm qua đã có tác động tích cực đến thái độ và hành vi của cả người hút thuốc và người không hút thuốc lá. Từ những cách truyền thông đa dạng về hình thức và nội dung, trên địa bàn tỉnh tỷ lệ người hút thuốc lá đã giảm đáng kể. Chính từ những tiểu phẩm tuyên truyền gần gũi với người dân đã xuất hiện nhiều tấm gương bỏ thuốc lá thành công.
Anh Nguyễn Hữu Miền, Đội trưởng Đội tuyên truyền, Trung tâm Văn hóa Thể thao huyện Đông Hưng có thâm niên hút thuốc lá 15 năm, mỗi ngày anh hút từ 10 điếu trở lên. Dù nhận được rất nhiều lời khuyên nhủ của gia đình nhưng anh vẫn nghiện, không bỏ được thuốc lá. May mắn, cách đây hơn 4 năm, anh Miền được chọn tham gia đóng tiểu phẩm tuyên truyền phòng, chống tác hại của thuốc lá do tỉnh tổ chức, nhận kịch bản và đọc đi đọc lại những nội dung trong kịch bản, với những lời cảnh báo từ thuốc lá, hệ lụy thuốc lá đối với sức khỏe, anh Miền đã bắt đầu suy nghĩ về việc hút thuốc lá của mình bấy lâu nay. Anh Nguyễn Hữu Miền chia sẻ: Trước kia, nhiều lần đi diễn về tôi thấy mình hay ho hắng, ốm vặt, răng thì cứ vàng đi rất xấu... vì hút quá nhiều thuốc lá. Khi trực tiếp nhận, đọc kịch bản, trực tiếp vào vai diễn liên quan đến thuốc lá, ngẫm nghĩ lại tôi thấy thuốc lá thực sự đã ảnh hưởng trực tiếp đến sức khỏe, công việc của tôi nhiều năm qua. Tôi đã chuẩn bị tinh thần và quyết tâm cao bỏ thuốc để bảo vệ sức khỏe của mình và làm tròn trách nhiệm của một tuyên truyền viên về phòng, chống tác hại của thuốc lá.

Quyết định bỏ thuốc lá ngay sau khi vào vai diễn tuyên truyền, đến nay sau 4 năm, anh Miền vẫn kiên trì, không hề tái nghiện và cũng đã tuyên truyền, động viên cho nhiều người xung quanh bỏ thuốc lá. Anh Miền cho biết thêm: Cho đến bây giờ, tôi may mắn, vinh dự vẫn được chương trình phòng, chống tác hại của thuốc lá chọn đóng vai trong các tiểu phẩm, được đồng hành cùng với đội tuyên truyền về nội dung rất ý nghĩa này. Bằng những gì thiết thực nhất, cả đội tuyên truyền chúng tôi đều muốn chuyển tải tới tất cả mọi người thông điệp nên bỏ thuốc vì sức khỏe của mình và người thân...

Bản thân anh Miền, khi bỏ thuốc lá thành công cho đến ngày hôm nay anh đã cảm thấy rất vui mừng nhưng những người thân trong gia đình anh còn cảm thấy hạnh phúc hơn gấp bội lần. Chị Nguyễn Thị Duyên - vợ anh Miền vui mừng chia  sẻ: Tôi và các con tôi trước đây từng rất buồn khi khuyên nhủ nhiều lần nhưng anh Miền không bỏ được thuốc lá. Nhưng giờ gia đình tôi rất vui mừng, hạnh phúc vì anh Miền không còn hút thuốc lá, thuốc lào nữa. Công việc của anh phải nói, phải diễn, sau khi anh bỏ được thuốc lá, dù nói nhiều, hát nhiều nhưng anh không còn bị mất tiếng và ho như trước. Tại gia đình, không khí cũng trong lành, các con không còn phải hít khói thuốc thụ động. Món quà lớn nhất sau bỏ thuốc của chồng tôi đó là sức khỏe được cải thiện.`,
  12: `Cai thuốc lá dù khó nhưng không phải là không thể nếu người muốn cai thuốc có quyết tâm cao, kiên trì đến cùng. Ngoài ra, người cai nghiện thuốc lá nên duy trì thói quen sinh hoạt lành mạnh, thường xuyên luyện tập thể thao, không nên thức khuya, duy trì việc ngủ đủ giấc và ngủ đúng giờ…
Là một người có trình độ, thường xuyên cập nhật thông tin, anh Nguyễn Hiếu (sinh năm 1985), ở phường Liên Bảo, thành phố Vĩnh Yên, tỉnh Vĩnh Phúc biết rất rõ tác hại của thuốc lá. Tuy nhiên, để bỏ được thuốc lá lại là một câu chuyện khác.
 
Anh Hiếu cho biết: “Tôi hút thuốc lá từ khi còn là sinh viên. Biết hút thuốc lá rất có hại cho sức khỏe nên đã nhiều lần tôi có ý định bỏ thuốc lá nhưng đều không thành công. Là kiến trúc sư, công việc của tôi khá căng thẳng, thường xuyên phải thức khuya để thiết kế mô hình, vẽ đồ án, đồ họa, những lúc ấy, hút thuốc lá giúp tôi tỉnh táo hơn, làm việc hiệu quả hơn. Tuy nhiên, tôi cũng tự tiết chế bản thân, cố gắng hút ít hơn…”.
 
Chất nicotine trong thuốc lá là nguyên nhân chính khiến người hút thuốc bị nghiện và dần lệ thuộc vào thuốc lá. Chỉ 7 giây sau khi hút thuốc lá, nicotine đã có tác dụng hưng phấn lên vỏ não, sự hưng phấn đó được não bộ ghi nhớ. Khi trạng thái hưng phấn qua đi, có nghĩa là lượng nicotine dần bị thiếu hụt, lúc này, não bộ sẽ kích thích gây cảm giác thèm thuốc lá.
 
Nếu không có nicotine, hoạt động của não bộ sẽ bị cản trở rất nhiều, do đó, người hút thuốc lá phải tiếp tục hút thuốc để cung cấp cho cơ thể chất nicotine cần thiết. Chính vì tác dụng kích thích nhanh, mạnh, gây hưng phấn tức thời, mà nicotine khiến người hút nghiện thuốc lá từ trung bình đến nặng, và một khi đã nghiện rồi thì rất khó bỏ.
 
Cai thuốc lá dù khó nhưng không phải là không thể nếu người muốn cai thuốc có quyết tâm cao, kiên trì đến cùng. Câu chuyện của anh Mạnh Hải (sinh năm 1987), ở phường Ngô Quyền, thành phố Vĩnh Yên, tỉnh Vĩnh Phúc là một minh chứng. Anh Hải hút thuốc lá đã hơn 10 năm nay, trung bình mỗi ngày, anh hút 1 - 2 bao thuốc lá. Người thân trong gia đình nhiều lần khuyên nhủ, nhưng cũng không ngăn được anh Hải hút thuốc lá. Cho đến khi, anh Hải chứng kiến người bạn đồng nghiệp bị ung thư phổi và mất khi tuổi đời còn rất trẻ, thì anh mới quyết tâm cai thuốc lá.
 
Anh Hải cho biết: “Tôi nhận ra tác hại nghiêm trọng của thuốc lá và quyết tâm cai thuốc. Tôi vứt hết thuốc lá, gạt tàn thuốc, lúc nào cũng để sẵn kẹo cao su trong túi để nếu thèm thuốc lá thì nhai kẹo cho quên đi. Vợ tôi cũng trợ giúp rất nhiều trong quá trình tôi cai nghiện thuốc lá. Cô ấy tìm hiểu các phương pháp hỗ trợ cai nghiện thuốc lá và khuyên tôi nên uống nhiều nước, luyện tập thể thao; khi thèm thuốc lá có thể xem tivi, đi tắm, chơi game, làm việc nhà, đi chơi... Ngoài ra, cô ấy còn nghiên cứu về chế độ ăn uống cho người cai nghiện thuốc lá; tăng cường rau xanh và làm nước hoa quả giàu vitamin C giúp tôi bỏ thuốc…”.
 
Theo khuyến cáo của các bác sĩ, để cai thuốc lá thành công, không nên dừng hút thuốc một cách đột ngột, nên giảm lượng thuốc lá một cách từ từ và tiến tới bỏ hẳn. Như vậy, các cơn thèm thuốc cũng sẽ có thời gian giảm dần và tự điều chỉnh phù hợp với sức đề kháng của cơ thể. Khi có cảm giác thèm thuốc lá, có thể nhai các loại kẹo cao su có chất nicotine, kẹo cao su có vị bạc hà để đánh lạc hướng cảm giác.
 
Người cai nghiện thuốc lá nên duy trì thói quen sinh hoạt lành mạnh, thường xuyên luyện tập thể thao, không nên thức khuya, duy trì việc ngủ đủ giấc và ngủ đúng giờ…/.`,
  13: `VTV.vn - Sau 13 năm hút thuốc lá, anh Trần Văn Chiến đã từ bỏ thành công. Đây cũng chính là tấm gương cho những người còn chưa muốn rời xa khói thuốc.
Anh Trần Văn Chiến (Gia Lâm, Hà Nội) mới ngoài 30 tuổi nhưng anh đã từng hút thuốc lá tới 13 năm. Sau khi bỏ thuốc lá được 3 năm nay, anh Chiến cảm thấy rất khoẻ mạnh. Ngày xưa, anh hút thuốc rất nhiều, có thời điểm hút tới 2 bao thuốc trong một ngày.

"Lý do tôi hút thuốc là do tuổi trẻ, cũng là vì sự tò mò và muốn tìm hiểu, cũng đua đòi bạn bè nên nhiều lúc tôi muốn thực. Sau khi thử, tôi cảm thấy nghiện nặng hơn" - anh Chiến nhớ lại. Anh cho biết, quãng thời gian 13 năm hút thuốc lá, anh cảm thấy sức khỏe ngày càng yếu hơn, sức đề kháng kém dẫn đến hay mắc các bệnh về đường hô hấp, cúm mùa. Nhiều lúc anh bị ho, viêm họng rất lâu và dài, khó điều trị.

Động lực khiến anh Chiến quyết định bỏ thuốc lá trước hết vì sức khỏe của chính bản thân mình. Lý do quan trọng hơn nữa, anh muốn xây dựng gia đình và những đứa con khoẻ mạnh bởi qua tìm hiểu và qua các phương tiện thông tin đại chúng, anh nhận thức rõ khói thuốc lá ảnh hưởng như thế nào đối với bà mẹ và trẻ em.

Khi bỏ, buổi sáng thức dậy, anh Chiến rất thèm thuốc lá vì đó là thói quen. Quyết tâm từ bỏ thói quen đó, buổi sáng thức dậy, anh Chiến uống một cốc nước thay vì hút một điếu thuốc. Anh khuyên mọi người có thể cho một chút muối trắng vì vị mặn có thể giúp giảm cơn thèm thuốc. Dần dần mọi thứ cũng đi vào ổn định, tần suất giữa các cơn thèm thuốc ngày càng giảm đi và dần dần anh từ bỏ được thuốc lá – điều mà bản thân anh và ngay cả những người quen biết anh từ lâu – coi là điều không tưởng.

"Các bạn hãy bỏ thuốc lá! Tôi đã làm được, tôi tin các bạn sẽ bỏ được thuốc lá như tôi" - anh Chiến nhắn nhủ những người đang muốn cai nghiện thuốc lá.
Trong chương trình Sống khỏe mỗi ngày, PGS. TS. Phan Thu Phương khẳng định, việc bỏ thuốc lá là không bao giờ muộn đối với tất cả mọi người, vì việc dừng thói quen hút thuốc lá ở bất kỳ thời điểm nào trong cuộc sống thì đều có lợi cho sức khỏe. Vì thế, bạn bỏ thuốc lá càng sớm thì sẽ càng giảm nguy cơ bệnh tật.

PGS. TS. Phan Thu Phương nhắn nhủ mọi người đang hút thuốc lá: Bỏ thuốc lá tuy khó nhưng không phải không bỏ được: "Bạn bỏ rất nhiều lần rồi, bạn đã từng bị tái nghiện rồi nhưng mà sẽ có lúc bạn đạt được đến thành công nếu bạn kiên trì, quyết tâm".`,
  14: `Vì không muốn sức khỏe của các cháu bị ảnh hưởng bởi khói thuốc lá, ông Nguyễn Văn Ngư (Bắc Ninh) quyết tâm cai thuốc. 

Từ ngày Phạm Văn Ngư, 60 tuổi bỏ hẳn thuốc lá, người dân thôn Đồng Xoài, xã Đại Đồng, huyện Thuận Thành, Bắc Ninh dành nhiều lời khen cho ông. "Nhiều người bảo tôi phong độ, trẻ hơn so với tuổi thật, da dẻ hồng hào nữa. Các bà vợ trong xóm lấy tôi làm tấm gương cho chồng mình", ông Ngư nói.

Thói quen, nề nếp sinh hoạt của ông cũng thay đổi. Trước đây, buổi sáng sau khi vệ sinh cá nhân, ông Ngư ngồi nhâm nhi điếu thuốc. Hiện, người đàn ông 60 tuổi thay bằng hoạt động chạy bộ, sau ăn sáng sẽ thay đồng phục đến làm việc tại nhà máy gần nhà. 
17 tuổi, ông Ngư biết đến thuốc lá cuộn mua ở Lạng Sơn. Ngày đó, chàng trai trẻ hút thuốc như nhóm đàn ông trong xóm, bản thân coi đó là thú vui và không nghĩ về tác hại với cơ thể khi sức khỏe đang độ "bẻ gãy sừng trâu". Theo thời gian, ông dần cảm thấy thuốc lá là một phần không thể thiếu trong cuộc sống của mình. 

Sau này, khi thuốc lá có dạng đóng gói, ông ước chừng hút khoảng hơn một bao mỗi ngày. Theo năm tháng, tần suất ông hút tăng lên, khoảng 2 bao một ngày. Ước tính, mỗi tháng ông Ngư chi 600.000 đồng cho việc mua thuốc lá, số tiền không nhỏ với những người "bán mặt cho đất, bán lưng cho trời". 

Ông từng bỏ thuốc lá nhiều lần nhưng tái nghiện vì tiếp xúc với khói thuốc từ xung quanh, căng thằng, rảnh rỗi lại lôi ra sử dụng. 

Việc nghiện thuốc lá gây nhiều trở ngại trong cuộc sống của ông. Có lúc đang đi làm, thậm chí trong bữa ăn, khi thèm thuốc lá, ông Ngư lại dừng mọi việc lại. Về sức khỏe, nhiều lần đi khám, bác sĩ cảnh báo, tình trạng cuống phổi ông đậm hơn, tiềm ẩn nguy cơ bệnh lý ở bộ phận này.
Tuy nhiên, lý do lớn thôi thúc ông cai thuốc là các cháu bên nội, ngoại. Nhiều lần, khi thấy ông Ngư hút, lũ trẻ nhăn mặt chạy đi kèm theo lời khuyên "ông bỏ thuốc lá đi, cô giáo con bảo hại sức khỏe lắm, ảnh hưởng đến những người xung quanh nữa", ông nhớ lại.  

Bản thân biết thuốc lá có hại, nghĩ đến việc bỏ nhưng quyết tâm chưa cao, dường như, người lớn trong gia đình đã chấp nhận thói quen xấu của ông dù không yêu thích gì. 

"Tôi thực sự quyết tâm dứt hẳn thứ độc hại này khi thấy mấy đứa cháu ho, tôi nghĩ khói thuốc ảnh hưởng đến sức khỏe bọn trẻ. Nhiều khi mấy ông cháu chơi cùng nhau, khi lôi thuốc ra hút, để ý thấy chúng nhăn mặt chạy đi. Tương lai của bọn trẻ là điều khiến bản thân lưu tâm, tôi không muốn thói quen của mình ảnh hưởng đến chúng", ông Ngư cho biết. 

Nghiêm túc với quyết định của mình, ông chủ động đọc thông tin, tham khảo lời khuyên của nhiều tấm gương cai thuốc lá thành công, đồng thời liên hệ tổng đài tư vấn cai nghiện thuốc lá miễn phí 18006606 của Bệnh viện Bạch Mai để nhận hỗ trợ.

Trò chuyện, nắm tình hình, nguyện vọng của ông, các tư vấn viên hỗ trợ nhiệt tình. Mỗi khi thèm thuốc, thấy nhạt mồm, ông Ngư sẽ cắn một miếng quế cho tê lưỡi, sau đó nhai một viên kẹo cao su để quên cảm giác khó chịu.
Lặp lại những mẹo nhỏ cùng với ý chí quyết tâm, đến nay tròn 3 năm ông Ngư không sử dụng thuốc lá. Hiện, ông ăn uống điều độ, tập thể dục điều độ nên sức khỏe tốt, tinh thần vui vẻ. 

Ông Ngư tâm sự, với người nghiện thuốc lá lâu năm việc bỏ thuốc không hề đơn giản nhưng nếu quyết tâm thì chắc chắn sẽ thành công. Ngoài ra, người cai thuốc lá cũng cần kiên trì, nghị lực, bản lĩnh, không nên thử hút thuốc lá lại. 

Theo thống kê của WHO, trên thế giới, 90% bệnh nhân bị bệnh phổi có liên quan đến thuốc lá. Đây cũnglà nguyên nhân khiến 73% số ca tử vong (chủ yếu ở các nước có thu nhập trung bình, thấp). Nếu không có các biện pháp ngăn chặn kịp thời thì trong thế kỷ 21, tổng số ca tử vong do các căn bệnh liên quan đến sử dụng thuốc lá sẽ tới một tỷ người. 

Tại Việt Nam, theo thống kê của các bệnh viện, 96,8% các ca bệnh nhân bị bệnh phổi do thuốc lá gây ra. Người hút thuốc có nguy cơ mắc ung thư phổi cao gấp 22 lần so vói người bình thường, cứ 5 người hút thuốc thì có một người mắc bệnh phổi tắc nghẽn mạn tính, khó chữa trị.

`,
  15: `Nếu bạn đang tìm kiếm cách để bỏ thuốc lá thì một trong những cách đơn giản và dễ làm nhất là tập thể dục. Theo một nghiên cứu mới, tập thể dục có thể giúp ích cho việc cai thuốc lá.
Trang Medical News Today dẫn nghiên cứu trên cho thấy hút thuốc không tốt đối với chúng ta, nhưng việc bỏ hút thuốc có thể rất khó khăn. Các triệu chứng cai thuốc như khó chịu, khó ngủ, hoặc thậm chí trầm cảm thường xảy ra ở những người đấu tranh với cai nghiện thuốc lá.
Tập thể dục được biết là cách làm giảm các triệu chứng cai nghiện nicotine. Các nghiên cứu cũ đã chỉ ra rằng thậm chí một đợt tập thể dục vừa phải trong 10 phút ngắn cũng có thể có những tác động tức thời trong việc làm giảm thèm muốn thuốc lá. Còn theo nghiên cứu mới này, tập thể dục ảnh hưởng đến sự thèm muốn nicotin ở chuột.
Tiến sĩ Alexis Bailey, giảng viên cao cấp về dược lý thần kinh học tại Đại học St George ở London (Anh), là tác giả của nghiên cứu, và phát hiện này đã được đăng trên Tạp chí Dược học Anh quốc.
Bác sĩ Bailey và nhóm của ông đã điều trị chuột với nicotine trong 14 ngày, sau đó cho chúng thực hiện một trong ba chế độ chạy bánh xe: 24 giờ mỗi ngày, 2 giờ mỗi ngày, hoặc không tập thể dục.
Vào ngày thứ 14, các nhà nghiên cứu đã đánh giá các triệu chứng cai nghiện của động vật gặm nhấm. Các phần não của chuột cũng được phân tích và phát hiện ra rằng "những con chuột được điều trị bằng nicotine thực hiện hoạt động trên bánh xe 2 giờ hoặc 24 giờ có sự giảm đáng kể triệu chứng cai nghiện thuốc so với nhóm thụ động".
Ngoài ra, ở những con chuột có tập thể dục, các nhà nghiên cứu thấy sự gia tăng hoạt động của một loại thụ thể nicotine não gọi là alpha7 nicotinic acetylcholine. Các thụ thể ở hippocampus của chuột, một vùng não liên quan đến việc tạo ra những ký ức mới và liên quan đến rối loạn tâm trạng.`,
  16: `(Dân trí) - Không ai phủ nhận "cai" thuốc lá là một việc khó, tuy nhiên nếu hiểu rõ bỏ thuốc có tác dụng như thế nào, chắc chắn các đấng mày râu sẽ có thêm động lực để bớt mặn mà với thuốc.
Giáo sư Elizabeth Krall và các cộng sự trong tổ chức chăm sóc sức khỏe ở trường ĐH Dental Medicine (Boston) đã tiến hành thu thập dữ liệu, nghiên cứu từ những năm 1960. Trong số hơn 2.200 quý ông tham gia nghiên cứu, các nhà khoa học đã phát hiện ra có 483 người đã từng hút và bỏ thuốc lá. Nhìn chung, những người này đều bắt đầu hút thuốc khi còn ở độ tuổi teen và trong khoảng 30 năm tiếp theo, cứ bình quân họ phải hút hết 1 gói/ngày.

 

Tuy nhiên, nếu cai được thuốc, bạn có thể thấy được lợi ích của nó một cách rõ ràng và gần như tức thời:

 

- Chỉ sau 20 phút tránh xa thuốc lá, huyết áp và tim mạch sẽ trở lại trạng thái ổn định bình thường.

 

- Sau 1 ngày không hút thuốc, có thể loại bỏ nguy cơ về các bệnh tim mạch.

 

Tuy nhiên, những lợi ích này sẽ thực sự phát huy nếu cai thuốc hẳn bởi nghiên cứu cho thấy: Khoảng 15 năm sau khi bỏ thuốc, tỷ lệ mắc bệnh ung thư và các vấn đề về tim mạch hoàn toàn biến mất như thể bạn chưa từng động đến thuốc.

 

Các nhà nghiên cứu cũng nhấn mạnh rằng, nếu không quyết tâm, khả năng tái nghiện ở những người này là rất cao. Krall cho rằng, trong năm đầu tiên bỏ thuốc, tỷ lệ tái nghiện chiếm từ 60% đến 90%. Sau 2 năm, tỷ lệ tái hút chiếm 15%.

 

Những người cố gắng bỏ thuốc hầu hết đều tái nghiện trong vài năm đầu bởi vì đây là khoảng thời gian mà những tác động của việc thiếu thuốc thể hiện rõ ràng và mạnh mẽ nhất. Phải mất từ 4 đến 6 tuần mới khắc phục được những triệu chứng này. Nếu không quyết tâm và kiên trì, rất dễ “ngựa quen đường cũ”. Đến 19% nam giới đã tái hút trong vòng 2 năm sau khi bỏ thuốc.

 

Nghiên cứu này cũng chỉ ra rằng, những ai có thể cai thuốc trong vòng 2 năm thì khả năng “tuyệt giao” thành công với thuốc lá là rất cao. Từ 2 - 6 năm, bình quân mỗi năm chỉ từ 2 - 4% người tái hút. Nếu bỏ thuốc từ 10 năm trở lên, chưa đầy 1% tái nghiện. Nguyên nhân lớn nhất dẫn đến việc tái hút này là sự căng thẳng, lo lắng và bực bội khi thiếu thuốc lá. Ngoài ra, họ sẽ phải thể hiện bản lĩnh khi  thấy bạn bè hoặc một thành viên trong gia đình phì phèo điếu thuốc. Mỗi lần như vậy, họ lại bị kích thích và thèm được hút thuốc lá, rồi mọi chuyện lại trở về như cũ.

 

Các nhà nghiên cứu cũng phát hiện ra rằng, những người uống nhiều rượu hoặc cà phê có khả năng tái nghiện thuốc cao hơn.

 

Hầu hết mọi người đều cố gắng để bỏ thuốc 5 đến 7 lần mới đi đến thành công. Các nhà nghiên cứu khuyên rằng, nên tự tin vào khả năng chấm dứt thuốc lá của mình bởi lẽ không gì có lợi cho sức khỏe của bạn hơn là ngừng hút thuốc lá.`,
  17: `Lời chia sẻ khiêm tốn của anh Lê Đình Thung (bảo vệ cổng sau bệnh viện quận 5, năm nay đã 56 tuổi) về hành trình cai nghiện thuốc lá với những lần thất bại và vượt qua những lần cám dỗ, mời gọi hút thuốc lá của bạn bè trong những lúc trà dư tửu hậu. Chính vì điều đó, anh luôn tự nhắc nhở bản thân phải luôn kiên trì không tái nghiện thuốc lá hàng giờ, hàng ngày. Theo anh, cai nghiện thuốc lá là phải cai nghiện lâu dài, bền bỉ và kiên trì.

Lời chia sẻ khiêm tốn của anh Lê Đình Thung (bảo vệ cổng sau bệnh viện quận 5, năm nay đã 56 tuổi) về hành trình cai nghiện thuốc lá với những lần thất bại và vượt qua những lần cám dỗ, mời gọi hút thuốc lá của bạn bè trong những lúc trà dư tửu hậu. Chính vì điều đó, anh luôn tự nhắc nhở bản thân phải luôn kiên trì không tái nghiện thuốc lá hàng giờ, hàng ngày. Theo anh, cai nghiện thuốc lá là phải cai nghiện lâu dài, bền bỉ và kiên trì.

Vào một buổi chiều mưa, trước cổng bệnh viện quận 5, người bảo vệ có vóc dáng cao vừa tầm, nước da ngâm đen và ở anh toát lên một dáng vẻ bình dị, chững chạc, đầy nghị lực của một người trung niên tầm hơn 50 tuổi đang hướng dẫn người dân khu vực thăm khám bệnh. Phút chốc, anh lại nhìn thấy có người móc bao thuốc lá ra định hút, anh lại quay sang nhắc nhở và khuyên người dân không nên hút thuốc trong khuôn viên bệnh viện. Nhưng lạ thay, ai ai ở đây cũng vui vẻ cất bao thuốc lá, dập tắt điếu thuốc mà không một chút than phiền anh. Hỏi chuyện một anh bảo vệ làm việc cùng anh được biết: đó là anh Lê Văn Thung và cũng là người có thâm niên nghiện hút thuốc lá từ năm 18 tuổi. Nhưng gần 7 năm nay, anh đã cai nghiện hoàn toàn thuốc lá, cho dù có "mời" anh cũng kiên quyết không hút và khuyên người khác đừng hút thuốc lá vì có hại cho sức khỏe. 
Để có được gần 7 năm cai nghiện thuốc lá, anh Thung đã có 4 lần "thất bại" khi cai nghiện. Cứ mỗi lần quyết tâm cai nghiện, anh lại có cảm giác thèm thuốc. Nhớ lại lần đầu cai nghiện, anh Thung cho biết: lúc đó, người cảm thấy khó chịu, lạt miệng, thèm ăn và ăn nhiều. Bỏ thuốc được 1 năm, nhưng trong một lần ngồi "trà dư tửu hậu", bạn bè mời điếu thuốc, như thói quen tôi lại hút. Thế là anh tái nghiện thuốc lá thêm 3 năm, rồi bỏ được 2 - 3 năm lại tái nghiện. Sau một khoảng thời gian dài, khi thấy cơ thể có mùi hôi, môi thâm, móng tay chuyển màu vàng và những cơn ho nhiều, anh lại quyết tâm cai nghiện thuốc lá thêm lần nữa - lần thứ 4 này và đến nay đã được gần 7 năm nay.
Sau những lần thất bại, anh Thung nghiệm ra một điều là "thuốc lá rất dễ làm mình tái nghiện, chỉ cần hút lại 1 điếu là có thể tái nghiện lại liền". Lần này, anh đặt ra cho mình mục tiêu và phương châm "4 Không: Không nhìn, không thấy, không lấy và không xin". Theo anh, thực hiện "4 không" nghĩa là khi đi ngang qua chỗ bán thuốc lá thì kiên quyết không nhìn. Khi thấy ai hút thuốc lá thì không lại gần, vì không thấy thuốc lá thì cảm giác thèm thuốc lá sẽ giảm dần. Có ai mời, anh cũng không lấy và có thấy thuốc lá, anh cũng không xin.
Với phương châm này và nghị lực quyết tâm từ bỏ thuốc lá, hàng ngày, anh Thung sắp xếp cho mình giờ giấc sinh hoạt có nề nếp để từ bỏ thói quen hút thuốc lá và ăn uống đúng bữa, đảm bảo đầy đủ chất dinh dưỡng để tránh cảm giác "lạt miệng, thèm ăn" sau khi bỏ thuốc lá. Anh Thung cho biết: theo thói quen trước đây, mỗi sáng uống cà phê, ăn trưa và sau ăn tối, tôi đều phải làm 1 điếu thuốc lá. Nhưng giờ, tôi bỏ không hút thuốc lá vào những thời điểm đó và tìm việc khác để làm. Cứ làm như thế khoảng 2 - 3 ngày, những cơn thèm thuốc lá của anh từ từ giảm dần và dứt hẳn.
Anh Lê Văn Đại làm việc cùng Tổ bảo vệ với anh Thung được 14 năm (từ 2003) cho biết: thời gian đầu trong quá trình cai nghiện thuốc lá, anh Thung vượt qua tương đối khó khăn. Cảm giác thèm thuốc lá làm cho tính tình anh Thung dễ cáu giận hơn, có khi làm tăng huyết áp phải dùng thuốc hạ áp và thường xuyên cảm thấy trong người bức rứt khó chịu. Thỉnh thoảng sau tan ca trực, hai anh em thường trò chuyện hoặc rủ nhau đi uống vài ly bia hoặc đi uống cà phê để anh Thung có thể quên đi cảm giác thèm thuốc lá.
Cứ thế, thời gian trôi qua gần 7 năm, anh Thung không một lần "đụng" lại điếu thuốc lá. Vừa cười vừa trò chuyện với tôi, anh Thung cho biết: sau khi cai nghiện thuốc lá, sức khỏe của anh cải thiện tốt hơn khoảng 50% so với trước đây. Những cơn ho kéo dài của trước đây không còn. Màu thâm của môi, màu vàng của móng tay cũng bắt đầu mờ dần và mùi cơ thể cũng không còn ám mùi của thuốc lá.
Cai nghiện thuốc lá, tôi làm được, bạn cũng có thể làm được.
Anh luôn tâm niệm "tôi làm được, bạn cũng có thể làm được". Từ kinh nghiệm bản thân, anh Thung luôn chia sẻ, nhắc nhở bạn bè, những người xung quanh mình và những người nghiện hút thuốc lá không nên hút thuốc lá. Vì một điều đơn giản là bảo vệ sức khỏe chính bản thân mình cũng như bảo vệ sức khỏe cộng đồng. 
Với vai trò nhiệm vụ tại bệnh viện, anh Thung rất nghiêm túc thực hiện những quy định về xây dựng môi trường bệnh viện không khói thuốc. Khi biết các anh em, bạn bè như tài xế hoặc bảo vệ khác hút thuốc, anh Thung luôn nhắc nhở và khuyên nên cai nghiện thuốc lá. Có trường hợp những bác sĩ đến làm việc ngắn hạn tại bệnh viện mà hút thuốc lá, anh Thung cũng không ngại trực tiếp nhắc nhở. Sau nhắc nhở, nếu vẫn còn hút thuốc lá trong bệnh viện, anh báo cáo lãnh đạo trong buổi giao ban của bệnh viện để lãnh đạo có ý kiến nhắc nhở thêm. Khi có trường hợp bệnh nhân hút thuốc trong khuôn viên bệnh viện, anh Thung nhẹ nhàng nhắc nhở họ không được hút thuốc trong bệnh viện - anh Lê Văn Đại, bảo vệ bệnh viện cho biết thêm.
Kiên trì với việc cai nghiện thuốc lá và sự nhiệt tình khuyên răn bỏ hút thuốc lá của anh Thung, những người bạn xung quanh anh cũng tập làm quen với việc ngừng hút thuốc lá và dần dần từ bỏ thuốc lá. Tuy nhiên, khi có ai ngưỡng mộ hay khen anh "nhiều năm bỏ được thuốc lá hoàn toàn là hay quá!" - anh Thung vẫn luôn khiêm tốn cho rằng "gần 7 năm cai nghiện thuốc lá chưa hẳn là thành công đâu, bạn ơi!".
Như lời chia sẻ khiêm tốn của anh Thung, cuộc chiến cai nghiện thuốc lá và phòng, chống tác hại thuốc lá còn nhiều cam go. Cuộc chiến này đòi hỏi sự kiên trì, nghị lực của những người cai nghiện thuốc lá và sự chung tay góp sức của toàn xã hội trong công tác phòng, chống tác hại thuốc lá.
Hiện nay, việc tìm thấy tàn thuốc ở những ngóc ngách khó thấy, trên những mái hiên khuất tầm nhìn cho thấy việc hút thuốc lá vẫn còn chưa thể giải quyết triệt để. Đặc biệt, việc bệnh nhân hoặc thân nhân lén hút thuốc lá ở những nơi vắng người và khó kiểm tra vẫn là một vấn đề lớn, dẫu cho việc tuyên truyền đã và đang được thực hiện quyết liệt trong bệnh viện. Tất cả những điều đó như đang kéo dài cuộc chiến phòng, chống tác hại của thuốc lá và thử thách lòng kiên nhẫn của mỗi nhân viên y tế chúng ta. Cần lắm những những sự thay đổi tích cực dù là nhỏ bé, khiêm tốn trong việc phòng, chống lại tác hại của thuốc lá của toàn xã hội, đặc biệt là từ những người như anh Thung!`
};


function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");

  // Giả sử bạn lưu accountId người dùng vào localStorage khi đăng nhập
  const accountId = Number(localStorage.getItem("accountId"));


  const fetchPost = async () => {
    try {
      const res = await api.get(`/community-posts/${id}`);
      const post = res.data;

      // Nếu có custom description cho bài này thì dùng, còn không thì giữ nguyên từ API
      const custom = customDescriptions[post.id];
      setBlog({
        ...post,
        description: custom || post.description,
      });
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    const accountId = Number(localStorage.getItem("accountId"));
    // if (!accountId || isNaN(accountId)) {
    //   toast.error("Không xác định được người dùng. Vui lòng đăng nhập lại!");
    //   return;
    // }

    try {
      await api.post(
        `/comments/community-posts/${id}/comments/by-account/${accountId}`,
        {
          content: trimmed,
          commentStatus: "PENDING",
          createAt: new Date().toISOString(),
          communityPostId: Number(id),
          accountId: accountId,
        }
      );
      toast.success("Gửi bình luận thành công, chờ xét duyệt!");
      setCommentInput("");
      fetchPost(); // reload lại bài viết để cập nhật bình luận mới
    } catch (error) {
      toast.error("Gửi bình luận thất bại!");
    }
  };


  const relatedBlogs = useMemo(() => {
    return [];
  }, [id]);

  if (loading)
    return <div className="blog-detail-loading">Đang tải bài viết...</div>;

  if (!blog)
    return <div className="blog-detail-notfound">Không tìm thấy bài viết</div>;

  return (
    <>
      <Navbar />
      <div className="blog-detail-page">
        <Link to="/blog" className="back-to-blog">
          <i className="fa-solid fa-circle-chevron-left"></i> Quay lại
        </Link>

        <div className="blog-detail-wrapper">
          <div className="blog-detail-header">
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-detail-img"
            />
            <div className="blog-detail-meta">
              <span className="blog-detail-date">{blog.date}</span>
              <span className="blog-detail-dot">•</span>
              <span className="blog-detail-category">{blog.category}</span>
            </div>
            <h1 className="blog-detail-title">{blog.title}</h1>
          </div>

          <div className="blog-detail-body">
            {blog.description?.split("\n").map((para, index) => (
              <p key={index} className="blog-detail-paragraph">
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Phần bình luận */}
          <div className="blog-comments-section">
            <h2>Bình luận</h2>

            {/* Form gửi bình luận */}
            <form onSubmit={handleCommentSubmit} className="blog-comment-form">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Nhập bình luận của bạn..."
                rows={3}
                className="blog-comment-input"
              />
              <button type="submit" className="blog-comment-submit">
                Gửi bình luận
              </button>
            </form>

            <div className="blog-comments-list">
              {(!blog.comments || blog.comments.length === 0) && (
                <p className="blog-no-comments">Chưa có bình luận nào.</p>
              )}
              {blog.comments
                .sort((a, b) => a.id - b.id)
                .map((c, idx) => (
                  <div key={c.id || idx} className="blog-comment-item">
                    <div className="blog-comment-text">{c.content}</div>
                    <div className="blog-comment-date">
                      {new Date(c.createAt).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;
