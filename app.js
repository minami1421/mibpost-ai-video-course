const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzJ5MRKwcOy41JZs4c7wrBqlION36ptqHJpzrwlX4_552wg1LG_kJ-SzlXrATs80Fc/exec";

const form = document.getElementById('registerForm');
const courseSelect = document.getElementById('courseSelect');
const sourceSelect = document.getElementById('sourceSelect');
const otherSourceWrap = document.getElementById('otherSourceWrap');
const statusEl = document.getElementById('formStatus');
const editingSoftwareOtherCheck = document.getElementById('editingSoftwareOtherCheck');
const editingSoftwareOtherWrap = document.getElementById('editingSoftwareOtherWrap');
const aiToolsOtherCheck = document.getElementById('aiToolsOtherCheck');
const aiToolsOtherWrap = document.getElementById('aiToolsOtherWrap');
const learningGoalSelect = form.querySelector('[name="learningGoal"]');
const learningGoalOtherWrap = document.getElementById('learningGoalOtherWrap');

const paymentSection = document.getElementById('payment');
const payCourse = document.getElementById('payCourse');
const payAmount = document.getElementById('payAmount');
const copyAccount = document.getElementById('copyAccount');
const backToForm = document.getElementById('backToForm');
const confirmPayment = document.getElementById('confirmPayment');
const paymentSlip = document.getElementById('paymentSlip');
const slipFileName = document.getElementById('slipFileName');
const slipPreviewWrap = document.getElementById('slipPreviewWrap');
const slipPreview = document.getElementById('slipPreview');
const paymentStatus = document.getElementById('paymentStatus');
const scheduleError = document.getElementById('scheduleError');
const lineFollowup = document.getElementById('lineFollowup');

let pendingPayload = null;

const COURSE_AMOUNT = {
  'Video Course — 990': 990,
  'Founding Batch Group Workshop — 2590': 2590,
  'Private 1 คน — 8990': 8990,
  'Private 2 คน — 5990/person': 11980,
  'Private 3 คน — 4990/person': 14970
};

function selectCourse(value){
  const map = {
    online: 'Video Course — 990',
    group: 'Founding Batch Group Workshop — 2590',
    private1: 'Private 1 คน — 8990',
    private2: 'Private 2 คน — 5990/person',
    private3: 'Private 3 คน — 4990/person'
  };
  if (map[value]) courseSelect.value = map[value];
  document.querySelector('#register').scrollIntoView({behavior:'smooth'});
}

document.querySelectorAll('[data-course]').forEach(el=>{
  el.addEventListener('click', ()=> selectCourse(el.dataset.course));
});

sourceSelect.addEventListener('change', ()=>{
  const isOther = sourceSelect.value === 'other';
  otherSourceWrap.classList.toggle('hidden', !isOther);
  const input = otherSourceWrap.querySelector('input');
  input.required = isOther;
  if (!isOther) input.value = '';
});

editingSoftwareOtherCheck.addEventListener('change', ()=>{
  editingSoftwareOtherWrap.classList.toggle('hidden', !editingSoftwareOtherCheck.checked);
  const input = editingSoftwareOtherWrap.querySelector('input');
  input.required = editingSoftwareOtherCheck.checked;
  if (!editingSoftwareOtherCheck.checked) input.value = '';
});

aiToolsOtherCheck.addEventListener('change', ()=>{
  aiToolsOtherWrap.classList.toggle('hidden', !aiToolsOtherCheck.checked);
  const input = aiToolsOtherWrap.querySelector('input');
  input.required = aiToolsOtherCheck.checked;
  if (!aiToolsOtherCheck.checked) input.value = '';
});

learningGoalSelect.addEventListener('change', ()=>{
  const isOther = learningGoalSelect.value === 'other';
  learningGoalOtherWrap.classList.toggle('hidden', !isOther);
  const input = learningGoalOtherWrap.querySelector('input');
  input.required = isOther;
  if (!isOther) input.value = '';
});

function privatePeopleFromCourse(course){
  if (course.includes('Private 1')) return '1';
  if (course.includes('Private 2')) return '2';
  if (course.includes('Private 3')) return '3';
  return '';
}

function buildPayload(){
  const fd = new FormData(form);
  const source = fd.get('source') === 'other'
    ? (fd.get('sourceOther') || 'อื่น ๆ')
    : (fd.get('source') || '');
  const course = fd.get('course') || '';

  const editingSoftwareOther = (fd.get('editingSoftwareOther') || '').trim();
  const editingSoftwareList = fd.getAll('editingSoftware').map(v => v === 'อื่น ๆ' && editingSoftwareOther ? `อื่น ๆ: ${editingSoftwareOther}` : v);
  const editingSoftware = editingSoftwareList.join(', ');

  const aiToolsOther = (fd.get('aiToolsOther') || '').trim();
  const aiToolsList = fd.getAll('aiTools').map(v => v === 'อื่น ๆ' && aiToolsOther ? `อื่น ๆ: ${aiToolsOther}` : v);
  const aiTools = aiToolsList.join(', ');

  const editingExperience = fd.get('editingExperience') || '';
  const aiExperience = fd.get('aiExperience') || '';
  const learningGoalOther = (fd.get('learningGoalOther') || '').trim();
  const learningGoalRaw = fd.get('learningGoal') || '';
  const learningGoal = learningGoalRaw === 'other' ? `อื่น ๆ: ${learningGoalOther}` : learningGoalRaw;
  const goal = fd.get('goal') || '';
  const preferredDays = fd.getAll('preferredDays').join(', ');
  const preferredTimes = fd.getAll('preferredTimes').join(', ');

  const note = [
    `ประสบการณ์ตัดต่อ: ${editingExperience}`,
    `โปรแกรมตัดต่อ: ${editingSoftware || '-'}`,
    `ระดับการใช้ AI: ${aiExperience}`,
    `AI ที่เคยใช้: ${aiTools || '-'}`,
    `เป้าหมายเรียน: ${learningGoal}`,
    `อยากให้ AI ช่วย: ${goal || '-'}`,
    `วันที่สะดวก: ${preferredDays || '-'}`,
    `ช่วงเวลาที่สะดวก: ${preferredTimes || '-'}`,
    `Facebook: ${fd.get('facebook') || '-'}`,
    `Instagram: ${fd.get('instagram') || '-'}`,
    `TikTok: ${fd.get('tiktok') || '-'}`,
    `YouTube: ${fd.get('youtube') || '-'}`
  ].join('\n');

  return {
    fullName: fd.get('name') || '',
    phone: fd.get('phone') || '',
    line: fd.get('line') || '',
    email: fd.get('email') || '',
    course,
    privatePeople: privatePeopleFromCourse(course),
    source,
    referrer: fd.get('referrer') || '',
    facebook: fd.get('facebook') || '',
    instagram: fd.get('instagram') || '',
    tiktok: fd.get('tiktok') || '',
    youtube: fd.get('youtube') || '',
    editingExperience,
    editingSoftware,
    editingSoftwareOther,
    aiExperience,
    aiTools,
    aiToolsOther,
    learningGoal,
    learningGoalOther,
    preferredDays,
    preferredTimes,
    goal,
    note
  };
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  if (!form.reportValidity()) return;

  pendingPayload = buildPayload();

  if (!pendingPayload.preferredDays || !pendingPayload.preferredTimes) {
    scheduleError.classList.remove('hidden');
    document.querySelector('.schedule-section')?.scrollIntoView({behavior:'smooth', block:'center'});
    return;
  }
  scheduleError.classList.add('hidden');

  const amount = COURSE_AMOUNT[pendingPayload.course];
  if (!amount) {
    statusEl.textContent = 'กรุณาเลือกแพ็กเกจก่อน';
    statusEl.style.color = '#b32828';
    return;
  }

  payCourse.textContent = pendingPayload.course.replace('/person','/คน');
  payAmount.textContent = amount.toLocaleString('th-TH');

  statusEl.textContent = '';
  paymentStatus.textContent = '';
  lineFollowup?.classList.add('hidden');
  paymentSection.classList.remove('hidden');
  setTimeout(()=>paymentSection.scrollIntoView({behavior:'smooth', block:'start'}), 60);
});

copyAccount.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText('0284033370');
    copyAccount.textContent = 'คัดลอกแล้ว ✓';
    setTimeout(()=>copyAccount.textContent='คัดลอกเลขบัญชี', 1400);
  }catch{
    window.prompt('คัดลอกเลขบัญชีนี้', '0284033370');
  }
});

backToForm.addEventListener('click', ()=>{
  paymentSection.classList.add('hidden');
  document.querySelector('#register').scrollIntoView({behavior:'smooth'});
});

paymentSlip.addEventListener('change', ()=>{
  const file = paymentSlip.files && paymentSlip.files[0];
  slipPreviewWrap.classList.add('hidden');
  if (!file){
    slipFileName.textContent = 'เลือกไฟล์สลิป';
    return;
  }
  slipFileName.textContent = file.name;
  if (file.type.startsWith('image/')){
    const url = URL.createObjectURL(file);
    slipPreview.src = url;
    slipPreviewWrap.classList.remove('hidden');
  }
});

function fileToDataUrl(file){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = ()=>resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

confirmPayment.addEventListener('click', async ()=>{
  const file = paymentSlip.files && paymentSlip.files[0];
  if (!pendingPayload){
    paymentStatus.textContent = 'ไม่พบข้อมูลใบสมัคร กรุณากลับไปกรอกใหม่';
    paymentStatus.style.color = '#ff7b72';
    return;
  }
  if (!file){
    paymentStatus.textContent = 'กรุณาแนบสลิปก่อนส่งใบสมัคร';
    paymentStatus.style.color = '#ff7b72';
    return;
  }
  if (file.size > 8 * 1024 * 1024){
    paymentStatus.textContent = 'ไฟล์สลิปต้องไม่เกิน 8 MB';
    paymentStatus.style.color = '#ff7b72';
    return;
  }

  confirmPayment.disabled = true;
  confirmPayment.textContent = 'กำลังส่งใบสมัครและสลิป...';
  paymentStatus.textContent = 'กรุณารอสักครู่ กำลังอัปโหลดหลักฐานการชำระเงิน';
  paymentStatus.style.color = '#c7d6ca';

  try{
    const slipDataUrl = await fileToDataUrl(file);
    const amount = COURSE_AMOUNT[pendingPayload.course] || 0;
    const registrationId = `AIV-${new Date().toISOString().replace(/\D/g,'').slice(0,14)}-${Math.floor(100+Math.random()*900)}`;

    const payload = {
      ...pendingPayload,
      registrationId,
      amount,
      paymentStatus: 'รอตรวจสอบ',
      slipName: file.name,
      slipType: file.type,
      slipDataUrl
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(payload)
    });

    const resultText = await response.text();
    let result = {};
    try { result = JSON.parse(resultText); } catch (_) {}

    if (!response.ok || result.success === false) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    paymentStatus.innerHTML = `ส่งเรียบร้อยแล้ว ✓<br><b>เลขอ้างอิง ${registrationId}</b><br>สลิปถูกบันทึกแล้ว กรุณาแอด LINE ด้านล่างเพื่อแจ้งการโอนเงินและรับวันนัดหมาย`;
    paymentStatus.style.color = '#68e27e';
    lineFollowup?.classList.remove('hidden');
    confirmPayment.textContent = 'ส่งข้อมูลเรียบร้อยแล้ว ✓';
    form.reset();
    paymentSlip.value = '';
    pendingPayload = null;
  }catch(err){
    console.error(err);
    paymentStatus.textContent = 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
    paymentStatus.style.color = '#ff7b72';
    confirmPayment.disabled = false;
    confirmPayment.textContent = 'ส่งใบสมัคร + สลิปยืนยันการชำระเงิน';
  }
});
