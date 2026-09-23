(function(){
"use strict";
  /* =========================================================
     ICONS
  ========================================================== */
  const ICON = {
    mapPin:'<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    calendar:'<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M3.5 10h17"/><path d="M8 3.5v4M16 3.5v4"/>',
    users:'<circle cx="9" cy="8.5" r="3"/><path d="M2.3 19c0-3.3 2.9-5.5 6.7-5.5s6.7 2.2 6.7 5.5"/><circle cx="17.3" cy="9.5" r="2.2"/><path d="M15.6 13.6c2.7.5 4 2.1 4 5.4"/>',
    camera:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7l1.3-2.3h5.4L16 7"/><circle cx="12" cy="13.6" r="3.4"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.5-4.5"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    arrowLeft:'<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
    face:'<circle cx="12" cy="12" r="8.3"/><path d="M9 10.6v.6M15 10.6v.6"/><path d="M9 15.2c1.1 1 5 1 6 0"/>',
    phone:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18.2h2"/>',
    alertTri:'<path d="M12 4 21 19H3z"/><path d="M12 10v4"/><path d="M12 16.2v.3"/>',
    check:'<path d="M4 12.5l5 5L20 6"/>',
    chevDown:'<path d="M6 9l6 6 6-6"/>',
    database:'<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.6 3.4 3 7.5 3s7.5-1.4 7.5-3V6"/><path d="M4.5 12v6c0 1.6 3.4 3 7.5 3s7.5-1.4 7.5-3v-6"/>',
    filter:'<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>',
  };
  function icon(name, cls){ return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[name]||''}</svg>`; }

  /* =========================================================
     MOCK DATA
  ========================================================== */
  const NAME_POOL = [
    "Ahmed Mohamed","Sara Ali","Omar Hassan","Menna Ali","Mahmoud Hassan","Nada Ahmed","Ali Mohamed","Youssef Ahmed",
    "Mariam Khaled","Karim Adel","Hana Tarek","Sherif Nabil","Dina Fathy","Amr Salah","Rana Fouad","Tarek Nasser",
    "Yasmin Adly","Khaled Samir","Salma Reda","Hossam Zaki","Nourhan Adel","Youssef Kamal","Ziad Farouk","Laila Hosny",
    "Mostafa Emad","Aya Sabry","Ibrahim Khalil","Farida Osman","Adham Naguib","Rawan Hesham","Belal Ashraf","Jana Waleed",
    "Mazen Ragab","Nourane Sabbah","Yassin Hany","Malak Fawzy","Seif Eldin","Fatma Gaber","Kirollos Samy","Habiba Nour"
  ];

  function avatarColor(name){
    const palette = ["#4C63D2","#7B5CE0","#1E8E5A","#B0740D","#2F5DE8","#C24A6B","#0E8C82","#8A5A2A"];
    let h = 0;
    for(let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) % 997;
    return palette[h % palette.length];
  }
  function initials(name){ return name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase(); }

  function buildRoster(baseId, total, presentN, absentN, leftN, presentTimes, leftTimes){
    const roster = [];
    let poolIdx = 0;
    for(let i=0;i<total;i++){
      const name = NAME_POOL[poolIdx % NAME_POOL.length];
      poolIdx++;
      const id = String(baseId + i + 1);
      let status, time;
      if(i < presentN){ status='present'; time = presentTimes[i % presentTimes.length]; }
      else if(i < presentN + absentN){ status='absent'; time=null; }
      else { status='left'; time = leftTimes[(i - presentN - absentN) % leftTimes.length]; }
      roster.push({ id, name, status, time });
    }
    return roster;
  }

  const PRESENT_TIMES_1 = ["9:52 AM","9:54 AM","9:55 AM","9:57 AM","9:58 AM","10:00 AM","10:01 AM","10:03 AM"];
  const LEFT_TIMES_1 = ["10:37 AM","10:41 AM","10:52 AM","11:05 AM","11:10 AM"];
  const ROSTER_EX1 = buildRoster(202300, 120, 85, 30, 5, PRESENT_TIMES_1, LEFT_TIMES_1);

  const PRESENT_TIMES_2 = ["1:52 PM","1:54 PM","1:56 PM","1:58 PM","2:00 PM","2:02 PM"];
  const LEFT_TIMES_2 = ["2:41 PM","2:56 PM"];
  const ROSTER_EX2 = buildRoster(202400, 85, 40, 43, 2, PRESENT_TIMES_2, LEFT_TIMES_2);

  const EXAMS = [
    { id:'ex1', course:'Database Systems', kind:'Midterm', hall:'Hall 204', time:'10:00 AM', date:'22 Sept 2026', today:true, students:120, status:'upcoming',
      attendance:{ present:85, absent:30, left:5 }, roster: ROSTER_EX1 },
    { id:'ex2', course:'Data Structures', kind:'Final', hall:'Hall 301', time:'2:00 PM', date:'22 Sept 2026', today:true, students:85, status:'upcoming',
      attendance:{ present:40, absent:43, left:2 }, roster: ROSTER_EX2 },
    { id:'ex3', course:'Operating Systems', kind:'Midterm', hall:'Hall 108', time:'9:00 AM', date:'23 Sept 2026', today:false, students:95, status:'scheduled' },
    { id:'ex4', course:'Computer Networks', kind:'Quiz', hall:'Hall 112', time:'11:00 AM', date:'18 Sept 2026', today:false, students:60, status:'completed' },
    { id:'ex5', course:'Software Engineering', kind:'Midterm', hall:'Hall 220', time:'1:00 PM', date:'15 Sept 2026', today:false, students:110, status:'completed' },
  ];
  const examById = id => EXAMS.find(e=>e.id===id);

  const ALERTS = [
    { id:'a1', examId:'ex1', type:'Face Movement', severity:'critical', student:'Ahmed Mohamed', studentId:'202301', reason:'Repeated head movement toward the neighboring seat', time:'10:42 AM', frame:'CAM 204-A' },
    { id:'a2', examId:'ex1', type:'Object Detection', severity:'warning', student:'Sara Ali', studentId:'202302', reason:'Mobile phone detected near the desk', time:'10:44 AM', frame:'CAM 204-A' },
    { id:'a3', examId:'ex1', type:'Face Movement', severity:'critical', student:'Mahmoud Hassan', studentId:'202305', reason:'Extended head turning, over 8 seconds', time:'10:51 AM', frame:'CAM 204-B' },
    { id:'a4', examId:'ex2', type:'Face Movement', severity:'critical', student:'Omar Hassan', studentId:'202403', reason:'Repeated glancing toward neighboring desk', time:'2:18 PM', frame:'CAM 301-A' },
    { id:'a5', examId:'ex4', type:'Object Detection', severity:'warning', student:'Nourhan Adel', studentId:'202150', reason:'Smartwatch detected on wrist', time:'11:22 AM', frame:'CAM 112-A' },
    { id:'a6', examId:'ex4', type:'Face Movement', severity:'critical', student:'Youssef Kamal', studentId:'202155', reason:'Repeated head movement', time:'11:34 AM', frame:'CAM 112-A' },
    { id:'a7', examId:'ex5', type:'Object Detection', severity:'warning', student:'Menna Ali', studentId:'201980', reason:'Folded paper note detected', time:'1:47 PM', frame:'CAM 220-B' },
  ];
  const alertById = id => ALERTS.find(a=>a.id===id);
  function examLabel(examId){ const e = examById(examId); return e ? `${e.course} — ${e.kind}` : ''; }
  function examHall(examId){ const e = examById(examId); return e ? e.hall : ''; }

  /* =========================================================
     STATE
  ========================================================== */
  const state = {
    page: 'dashboard',
    section: 'dashboard',
    examId: null,
    alertId: null,
    alertFrom: 'exam-monitoring',
    dbSearch: '', dbFilter: 'all',
    alertSearch: '', alertExamFilter: 'all', alertTypeFilter: 'all',
  };

  /* =========================================================
     SMALL HELPERS
  ========================================================== */
  function avatarHtml(name, size){
    const s = size || 30;
    return `<div class="sm-avatar" style="width:${s}px;height:${s}px;background:${avatarColor(name)};font-size:${Math.round(s*0.36)}px;">${initials(name)}</div>`;
  }
  function statusBadge(status){
    if(status==='present') return `<span class="badge badge-success"><span class="badge-dot"></span>Present</span>`;
    if(status==='absent') return `<span class="badge badge-danger"><span class="badge-dot"></span>Absent</span>`;
    return `<span class="badge badge-warning"><span class="badge-dot"></span>Left</span>`;
  }
  function severityColor(sev){ return sev==='critical' ? 'var(--danger)' : 'var(--warning)'; }
  function alertIconSvg(type){ return type==='Face Movement' ? icon('face') : icon('phone'); }

  function evidenceBoxStyle(seed){
    // deterministic pseudo box position for the mock bounding box overlay
    const positions = [
      {top:'28%',left:'34%',w:'22%',h:'34%'},
      {top:'20%',left:'52%',w:'20%',h:'38%'},
      {top:'34%',left:'20%',w:'24%',h:'30%'},
    ];
    const p = positions[seed % positions.length];
    return `top:${p.top};left:${p.left};width:${p.w};height:${p.h};`;
  }

  /* =========================================================
     RENDERERS — DASHBOARD
  ========================================================== */
  function renderDashboard(){
    const todays = EXAMS.filter(e=>e.today);
    const assignedCount = EXAMS.length;
    const activeCount = state.examId && examById(state.examId) && examById(state.examId).today ? 1 : 0;
    const recentAlerts = ALERTS.slice(0,6);

    return `
      <h1 class="page-title">Good to see you, Hassan</h1>
      <p class="page-desc">Here's what's happening across your assigned exams today.</p>

      <div class="stat-grid">
        <div class="stat-card" style="--stat-accent:var(--accent)">
          <div class="stat-label">${icon('database')}Assigned exams</div>
          <div class="stat-value">${assignedCount}</div>
          <div class="stat-foot">Across this exam session</div>
        </div>
        <div class="stat-card" style="--stat-accent:#0E8C82">
          <div class="stat-label">${icon('calendar')}Today's exams</div>
          <div class="stat-value">${todays.length}</div>
          <div class="stat-foot">Scheduled for 22 Sept 2026</div>
        </div>
        <div class="stat-card" style="--stat-accent:var(--danger)">
          <div class="stat-label">${icon('camera')}Active monitoring</div>
          <div class="stat-value">${activeCount}</div>
          <div class="stat-foot">${activeCount ? 'Live session in progress' : 'No live session right now'}</div>
        </div>
        <div class="stat-card" style="--stat-accent:var(--warning)">
          <div class="stat-label">${icon('alertTri')}Recent AI alerts</div>
          <div class="stat-value">${ALERTS.length}</div>
          <div class="stat-foot">Across all monitored exams</div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="card card-pad tight">
          <div class="section-head">
            <h2>Today's exams</h2>
            <button class="link" data-nav="my-exams">View all exams</button>
          </div>
          ${todays.map(e=>`
            <div class="mini-exam-row">
              <span class="dot"></span>
              <div class="info">
                <div class="t">${e.course} — ${e.kind}</div>
                <div class="s">${e.hall} · ${e.time} · ${e.students} registered</div>
              </div>
              <button class="btn btn-ghost" data-start-exam="${e.id}" style="padding:7px 12px;font-size:12.5px;">Start monitoring</button>
            </div>
          `).join('')}
        </div>

        <div class="card card-pad tight">
          <div class="section-head">
            <h2>Recent AI alerts</h2>
            <button class="link" data-nav="ai-alerts">View all alerts</button>
          </div>
          ${recentAlerts.map(a=>`
            <div class="mini-alert-row" data-open-alert="${a.id}" data-from="dashboard">
              <div class="alert-type-icon ${a.severity}">${alertIconSvg(a.type)}</div>
              <div class="info">
                <div class="t">${a.student} — ${a.type}</div>
                <div class="s">${examLabel(a.examId)}</div>
              </div>
              <div class="time">${a.time}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* =========================================================
     RENDERERS — MY EXAMS
  ========================================================== */
  function statusBits(exam){
    if(exam.status==='completed') return { label:'Completed', cls:'badge-neutral' };
    if(exam.status==='scheduled') return { label:'Scheduled', cls:'badge-accent' };
    return { label:'Ready to start', cls:'badge-success' };
  }

  function renderMyExams(){
    return `
      <h1 class="page-title">My Assigned Exams</h1>
      <p class="page-desc">Only exams assigned to you appear here. Monitoring becomes available on the day of the exam.</p>

      <div class="exam-grid">
        ${EXAMS.map(e=>{
          const sb = statusBits(e);
          const canStart = e.status==='upcoming';
          return `
          <div class="exam-card ${e.status==='completed'?'completed':''}">
            <div class="exam-card-top">
              <div class="title">${e.course} <span class="type">— ${e.kind}</span></div>
              <span class="badge ${sb.cls}">${sb.label}</span>
            </div>
            <div class="exam-meta">
              <div class="m">${icon('mapPin')}${e.hall}</div>
              <div class="m">${icon('clock')}${e.time}</div>
              <div class="m">${icon('calendar')}${e.date}</div>
              <div class="m">${icon('users')}${e.students} registered students</div>
            </div>
            <div class="exam-card-foot">
              ${canStart
                ? `<button class="btn btn-primary btn-block" data-start-exam="${e.id}">${icon('camera')}Start monitoring</button>`
                : e.status==='scheduled'
                  ? `<button class="btn btn-ghost btn-block" disabled>Opens on exam day</button>`
                  : `<button class="btn btn-ghost btn-block" disabled>${icon('check')}Session completed</button>`
              }
            </div>
          </div>`;
        }).join('')}
      </div>
    `;
  }

  /* =========================================================
     RENDERERS — EXAM MONITORING
  ========================================================== */
  function renderExamMonitoring(examId){
    const exam = examById(examId) || EXAMS.find(e=>e.status==='upcoming');
    const att = exam.attendance;
    const roster = exam.roster || [];
    const examAlerts = ALERTS.filter(a=>a.examId===exam.id);

    const presentList = roster.filter(s=>s.status==='present').slice(0,8);
    const absentList = roster.filter(s=>s.status==='absent').slice(0,8);
    const leftList = roster.filter(s=>s.status==='left').slice(0,8);
    const presentTotal = roster.filter(s=>s.status==='present').length;
    const absentTotal = roster.filter(s=>s.status==='absent').length;
    const leftTotal = roster.filter(s=>s.status==='left').length;

    function smCol(title, dotColor, list, total, shown){
      return `
        <div class="sm-col">
          <div class="sm-col-head">
            <div class="t"><span class="dot" style="background:${dotColor}"></span>${title}</div>
            <div class="count">${total}</div>
          </div>
          <div class="sm-list">
            ${list.length ? list.map(s=>`
              <div class="sm-row">
                ${avatarHtml(s.name,30)}
                <div class="who">
                  <div class="n">${s.name}</div>
                  <div class="i">ID: ${s.id}</div>
                </div>
                <div class="time">${s.time || '—'}</div>
              </div>
            `).join('') : `<div class="sm-row"><div class="i" style="padding:8px 0;">No students in this state</div></div>`}
            ${total > shown ? `<div class="sm-more">+${total-shown} more — open the student database</div>` : ''}
          </div>
        </div>
      `;
    }

    return `
      <div class="mon-header">
        <div class="titles">
          <div class="t">${exam.course} — ${exam.kind}</div>
          <div class="s">
            <span>${icon('mapPin')}${exam.hall}</span>
            <span>${icon('clock')}${exam.time}</span>
            <span>${icon('users')}${exam.students} students</span>
          </div>
        </div>
        <span class="live-pill"><span class="live-dot"></span>LIVE</span>
      </div>

      <div class="attend-grid">
        <div class="stat-card" style="--stat-accent:var(--text-faint)">
          <div class="stat-label">Total</div>
          <div class="stat-value">${exam.students}</div>
        </div>
        <div class="stat-card" style="--stat-accent:var(--success)">
          <div class="stat-label">Present</div>
          <div class="stat-value">${att.present}</div>
        </div>
        <div class="stat-card" style="--stat-accent:var(--danger)">
          <div class="stat-label">Absent</div>
          <div class="stat-value">${att.absent}</div>
        </div>
        <div class="stat-card" style="--stat-accent:var(--warning)">
          <div class="stat-label">Left</div>
          <div class="stat-value">${att.left}</div>
        </div>
      </div>

      <div class="mon-columns">
        <div>
          <div class="camera-box">
            <div class="scan-lines"></div>
            <div class="grid-overlay"></div>
            <div class="cam-top">
              <span class="cam-tag">${icon('camera')} ${exam.hall} — Overhead</span>
              <span class="rec-badge"><span class="d"></span>REC</span>
            </div>
            <div class="cam-center">
              ${icon('camera')}
              <div class="lbl">Live camera feed placeholder</div>
            </div>
            <div class="cam-bottom">
              <span>Frame rate 24fps</span>
              <span>${exam.time} session</span>
            </div>
          </div>

          <div style="margin-top:22px;">
            <div class="section-head">
              <h2>Student monitoring</h2>
              <span class="panel-scope">This exam only</span>
            </div>
            <div class="sm-columns">
              ${smCol('Present', 'var(--success)', presentList, presentTotal, presentList.length)}
              ${smCol('Absent', 'var(--danger)', absentList, absentTotal, absentList.length)}
              ${smCol('Left', 'var(--warning)', leftList, leftTotal, leftList.length)}
            </div>
            <div class="db-link-row">
              <button class="btn btn-ghost" data-nav="student-database" data-exam="${exam.id}">${icon('database')}View student database</button>
            </div>
          </div>
        </div>

        <div class="card" style="padding-bottom:6px;">
          <div class="panel-head">
            <h3>${icon('alertTri')}AI alerts</h3>
            <span class="panel-scope">Current exam only</span>
          </div>
          <div class="alert-list">
            ${examAlerts.length ? examAlerts.map((a,idx)=>`
              <div class="alert-card" style="--sev-color:${severityColor(a.severity)}">
                <div class="alert-snap">
                  <span class="frame-tag">${a.frame}</span>
                  <span class="frame-time">${a.time}</span>
                  <div class="box" style="${evidenceBoxStyle(idx)}"></div>
                </div>
                <div class="alert-body">
                  <div class="row1">
                    <span class="alert-type-label"><span class="b"></span>${a.type}</span>
                    <span style="font-size:11px;color:var(--text-faint);">${a.time}</span>
                  </div>
                  <div class="alert-fields">
                    <div class="f"><div class="k">Student</div><div class="v">${a.student}</div></div>
                    <div class="f"><div class="k">Student ID</div><div class="v">${a.studentId}</div></div>
                    <div class="f reason"><div class="k">Reason</div><div class="v">${a.reason}</div></div>
                  </div>
                  <button class="btn view-evidence-btn btn-block" data-open-alert="${a.id}" data-from="exam-monitoring" style="--sev-color:${severityColor(a.severity)};font-size:12.5px;padding:8px;">${icon('eye')}View evidence</button>
                </div>
              </div>
            `).join('') : `<div class="empty-state">${icon('alertTri')}<div>No alerts yet for this session</div></div>`}
          </div>
        </div>
      </div>
    `;
  }

  /* =========================================================
     RENDERERS — ALERT DETAILS
  ========================================================== */
  function renderAlertDetails(alertId){
    const a = alertById(alertId) || ALERTS[0];
    const backLabel = state.alertFrom === 'ai-alerts' ? 'Back to AI alerts' : 'Back to monitoring';
    return `
      <button class="back-link" data-back-from-alert="1">${icon('arrowLeft')}${backLabel}</button>
      <h1 class="page-title">AI Alert Details</h1>
      <p class="page-desc">Captured evidence and detection details for this alert.</p>

      <div class="evidence-shot" style="--sev-color:${severityColor(a.severity)}">
        <div class="tag-top">
          <span class="tag">${a.frame}</span>
          <span class="tag">${examHall(a.examId)}</span>
        </div>
        <span class="tag-time">${a.time}</span>
        <div class="center-icon">${icon('camera')}</div>
        <div class="box" data-label="${a.type}" style="${evidenceBoxStyle(1)}"></div>
      </div>

      <div class="card detail-card">
        <div class="detail-top">
          <span class="alert-type-label" style="--sev-color:${severityColor(a.severity)};font-size:15px;"><span class="b" style="background:${severityColor(a.severity)}"></span>${a.type}</span>
          <span class="badge ${a.severity==='critical'?'badge-danger':'badge-warning'}">${a.severity==='critical' ? 'Critical' : 'Needs review'}</span>
        </div>
        <div class="detail-grid">
          <div class="f"><div class="k">Student</div><div class="v">${a.student}</div></div>
          <div class="f"><div class="k">Student ID</div><div class="v">${a.studentId}</div></div>
          <div class="f"><div class="k">Time</div><div class="v">${a.time}</div></div>
          <div class="f"><div class="k">Detection type</div><div class="v">${a.type}</div></div>
          <div class="f full"><div class="k">Reason</div><div class="v">${a.reason}</div></div>
          <div class="f"><div class="k">Exam</div><div class="v">${examLabel(a.examId)}</div></div>
          <div class="f"><div class="k">Hall</div><div class="v">${examHall(a.examId)}</div></div>
        </div>
        <div class="detail-divider"></div>
        <button class="btn btn-ghost" data-back-from-alert="1">${icon('arrowLeft')}Back to monitoring</button>
      </div>
    `;
  }

  /* =========================================================
     RENDERERS — STUDENT DATABASE
  ========================================================== */
  function renderStudentDatabase(examId){
    const exam = examById(examId) || EXAMS.find(e=>e.roster);
    const roster = exam.roster || [];
    const q = state.dbSearch.trim().toLowerCase();
    const filtered = roster.filter(s=>{
      const matchesQ = !q || s.name.toLowerCase().includes(q) || s.id.includes(q);
      const matchesF = state.dbFilter === 'all' || s.status === state.dbFilter;
      return matchesQ && matchesF;
    });
    const shown = filtered.slice(0, 60);

    return `
      <button class="back-link" data-nav="exam-monitoring" data-exam="${exam.id}">${icon('arrowLeft')}Back to monitoring</button>
      <h1 class="page-title">Student Database</h1>
      <p class="page-desc">Students registered for ${exam.course} — ${exam.kind}, ${exam.hall}.</p>

      <div class="toolbar">
        <div class="search-box">
          ${icon('search')}
          <input type="text" id="dbSearchInput" placeholder="Search by name or student ID" value="${state.dbSearch.replace(/"/g,'&quot;')}" />
        </div>
        <select class="select-filter" id="dbStatusFilter">
          <option value="all" ${state.dbFilter==='all'?'selected':''}>All statuses</option>
          <option value="present" ${state.dbFilter==='present'?'selected':''}>Present</option>
          <option value="absent" ${state.dbFilter==='absent'?'selected':''}>Absent</option>
          <option value="left" ${state.dbFilter==='left'?'selected':''}>Left</option>
        </select>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Student ID</th><th>Status</th><th>Time</th></tr></thead>
          <tbody>
            ${shown.length ? shown.map(s=>`
              <tr>
                <td><div class="cell-student"><div class="tiny-avatar" style="background:${avatarColor(s.name)}">${initials(s.name)}</div><div class="n">${s.name}</div></div></td>
                <td>${s.id}</td>
                <td>${statusBadge(s.status)}</td>
                <td>${s.time || '—'}</td>
              </tr>
            `).join('') : `<tr><td colspan="4" style="text-align:center;color:var(--text-faint);padding:26px;">No students match this search</td></tr>`}
          </tbody>
        </table>
        <div class="table-note">Showing ${shown.length} of ${filtered.length} matching students${filtered.length!==roster.length ? ` (${roster.length} registered total)` : ''}.</div>
      </div>
    `;
  }

  /* =========================================================
     RENDERERS — AI ALERTS (all exams)
  ========================================================== */
  function renderAllAlerts(){
    const q = state.alertSearch.trim().toLowerCase();
    const filtered = ALERTS.filter(a=>{
      const matchesQ = !q || a.student.toLowerCase().includes(q) || a.studentId.includes(q);
      const matchesExam = state.alertExamFilter === 'all' || a.examId === state.alertExamFilter;
      const matchesType = state.alertTypeFilter === 'all' || a.type === state.alertTypeFilter;
      return matchesQ && matchesExam && matchesType;
    });

    const examOptions = EXAMS.filter(e=>ALERTS.some(a=>a.examId===e.id));

    return `
      <h1 class="page-title">AI Alerts</h1>
      <p class="page-desc">Every alert generated across all exams you have monitored — not limited to the exam currently open.</p>

      <div class="toolbar">
        <div class="search-box">
          ${icon('search')}
          <input type="text" id="alertSearchInput" placeholder="Search student name or ID" value="${state.alertSearch.replace(/"/g,'&quot;')}" />
        </div>
        <select class="select-filter" id="alertExamFilter">
          <option value="all" ${state.alertExamFilter==='all'?'selected':''}>All exams</option>
          ${examOptions.map(e=>`<option value="${e.id}" ${state.alertExamFilter===e.id?'selected':''}>${e.course} — ${e.kind}</option>`).join('')}
        </select>
        <select class="select-filter" id="alertTypeFilter">
          <option value="all" ${state.alertTypeFilter==='all'?'selected':''}>All alert types</option>
          <option value="Face Movement" ${state.alertTypeFilter==='Face Movement'?'selected':''}>Face Movement</option>
          <option value="Object Detection" ${state.alertTypeFilter==='Object Detection'?'selected':''}>Object Detection</option>
        </select>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>Time</th><th>Student</th><th>Student ID</th><th>Exam</th><th>Alert type</th><th>Reason</th><th>Evidence</th></tr></thead>
          <tbody>
            ${filtered.length ? filtered.map(a=>`
              <tr>
                <td>${a.time}</td>
                <td><div class="cell-student"><div class="tiny-avatar" style="background:${avatarColor(a.student)}">${initials(a.student)}</div><div class="n">${a.student}</div></div></td>
                <td>${a.studentId}</td>
                <td>${examLabel(a.examId)}</td>
                <td><span class="alert-type-label" style="--sev-color:${severityColor(a.severity)};font-size:12.5px;"><span class="b" style="background:${severityColor(a.severity)}"></span>${a.type}</span></td>
                <td style="color:var(--text-muted);max-width:220px;">${a.reason}</td>
                <td><button class="btn view-evidence-btn" data-open-alert="${a.id}" data-from="ai-alerts" style="--sev-color:${severityColor(a.severity)};">${icon('eye')}View evidence</button></td>
              </tr>
            `).join('') : `<tr><td colspan="7" style="text-align:center;color:var(--text-faint);padding:26px;">No alerts match this search</td></tr>`}
          </tbody>
        </table>
        <div class="table-note">Showing ${filtered.length} of ${ALERTS.length} alerts across all monitored exams.</div>
      </div>
    `;
  }

  /* =========================================================
     RENDERERS — SETTINGS
  ========================================================== */
  function renderSettings(){
    return `
      <h1 class="page-title">Settings</h1>
      <p class="page-desc">Your profile, account and notification preferences.</p>

      <div class="settings-grid">
        <div class="card settings-section">
          <h3>Profile</h3>
          <div class="sub">Your proctor account details</div>
          <div class="field-row"><span class="k">Name</span><span class="v">Hassan Mostafa</span></div>
          <div class="field-row"><span class="k">Email</span><span class="v">hassan.mostafa@examguard.edu</span></div>
          <div class="field-row"><span class="k">Role</span><span class="v">Proctor</span></div>
        </div>

        <div class="card settings-section">
          <h3>Account</h3>
          <div class="sub">Manage your sign-in and session</div>
         
          <div class="field-row"><span class="k">Password</span><button class="btn btn-ghost" style="padding:7px 13px;font-size:12.5px;">Change password</button></div>
          <div class="field-row"><span class="k">Session</span><button class="btn btn-ghost" data-logout style="padding:7px 13px;font-size:12.5px;">Log out</button></div>
        </div>

        <div class="card settings-section">
          <h3>Notification preferences</h3>
          <div class="sub">Choose what you're notified about</div>
          <div class="field-row"><span class="k">AI alert notifications</span><button class="toggle on" data-toggle="1"></button></div>
          <div class="field-row"><span class="k">System notifications</span><button class="toggle on" data-toggle="1"></button></div>
        </div>
      </div>
    `;
  }

  /* =========================================================
     NAVIGATION
  ========================================================== */
  const TITLES = {
    'dashboard': ['Dashboard', "Overview of your assigned exams"],
    'my-exams': ['My Exams', 'Exams assigned to you'],
    'exam-monitoring': ['Exam Monitoring', 'Live session in progress'],
    'alert-details': ['AI Alert Details', 'Captured evidence for this alert'],
    'student-database': ['Student Database', 'Registered students for this exam'],
    'ai-alerts': ['AI Alerts', 'All alerts across your monitored exams'],
    'settings': ['Settings', 'Profile, account and notifications'],
  };

  function setActiveNav(section){
    document.querySelectorAll('.nav-item').forEach(el=>{
      el.classList.toggle('active', el.dataset.nav === section);
    });
  }

  function navigate(page, params){
    params = params || {};
    if(page === 'exam-monitoring'){ state.examId = params.exam || state.examId || 'ex1'; state.section='my-exams'; }
    else if(page === 'student-database'){ state.examId = params.exam || state.examId || 'ex1'; state.dbSearch=''; state.dbFilter='all'; state.section='my-exams'; }
    else if(page === 'my-exams'){ state.section='my-exams'; }
    else if(page === 'ai-alerts'){ state.section='ai-alerts'; state.alertSearch=''; state.alertExamFilter='all'; state.alertTypeFilter='all'; }
    else if(page === 'dashboard'){ state.section='dashboard'; }
    else if(page === 'settings'){ state.section='settings'; }
    else if(page === 'alert-details'){ /* section unchanged, keep prior */ }

    state.page = page;
    render();
    document.getElementById('contentScroll').scrollTop = 0;
    closeMobileNav();
  }

  function openAlert(alertId, from){
    state.alertId = alertId;
    state.alertFrom = from || 'exam-monitoring';
    state.page = 'alert-details';
    render();
    document.getElementById('contentScroll').scrollTop = 0;
  }

  function backFromAlert(){
    if(state.alertFrom === 'ai-alerts'){ navigate('ai-alerts'); }
    else {
      const a = alertById(state.alertId);
      navigate('exam-monitoring', { exam: a ? a.examId : state.examId });
    }
  }

  function startMonitoring(examId){
    navigate('exam-monitoring', { exam: examId });
  }

  function logout(){
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');

  window.location.href = '/login';
}
  /* =========================================================
     RENDER DISPATCH
  ========================================================== */
  function render(){
    const [title, sub] = TITLES[state.page] || TITLES['dashboard'];
    let finalTitle = title, finalSub = sub;

    let html = '';
    switch(state.page){
      case 'dashboard': html = renderDashboard(); break;
      case 'my-exams': html = renderMyExams(); break;
      case 'exam-monitoring':
        html = renderExamMonitoring(state.examId);
        finalTitle = examLabel(state.examId) || title;
        finalSub = 'Live monitoring session';
        break;
      case 'alert-details': html = renderAlertDetails(state.alertId); break;
      case 'student-database':
        html = renderStudentDatabase(state.examId);
        finalTitle = 'Student Database';
        finalSub = examLabel(state.examId);
        break;
      case 'ai-alerts': html = renderAllAlerts(); break;
      case 'settings': html = renderSettings(); break;
      default: html = renderDashboard();
    }

    document.getElementById('content').innerHTML = html;
    document.getElementById('topbarTitle').textContent = finalTitle;
    document.getElementById('topbarSub').textContent = finalSub;
    setActiveNav(state.section);
    bindContentEvents();
  }

  /* =========================================================
     EVENT BINDING
  ========================================================== */
  function bindContentEvents(){
    const c = document.getElementById('content');

    c.querySelectorAll('[data-nav]').forEach(el=>{
      el.addEventListener('click', ()=> navigate(el.dataset.nav, { exam: el.dataset.exam }));
    });
    c.querySelectorAll('[data-start-exam]').forEach(el=>{
      el.addEventListener('click', ()=> startMonitoring(el.dataset.startExam));
    });
    c.querySelectorAll('[data-open-alert]').forEach(el=>{
      el.addEventListener('click', ()=> openAlert(el.dataset.openAlert, el.dataset.from));
    });
    c.querySelectorAll('[data-back-from-alert]').forEach(el=>{
      el.addEventListener('click', backFromAlert);
    });
    c.querySelectorAll('[data-toggle]').forEach(el=>{
      el.addEventListener('click', ()=> el.classList.toggle('on'));

    });
document.querySelectorAll('[data-logout]').forEach(el=>{
  el.addEventListener('click', logout);
});
   


    const dbInput = document.getElementById('dbSearchInput');
    if(dbInput){
      dbInput.addEventListener('input', (e)=>{
        state.dbSearch = e.target.value;
        renderKeepingFocus('dbSearchInput', ()=> render());
      });
    }
    const dbFilter = document.getElementById('dbStatusFilter');
    if(dbFilter){
      dbFilter.addEventListener('change', (e)=>{ state.dbFilter = e.target.value; render(); });
    }
    const alertSearch = document.getElementById('alertSearchInput');
    if(alertSearch){
      alertSearch.addEventListener('input', (e)=>{
        state.alertSearch = e.target.value;
        renderKeepingFocus('alertSearchInput', ()=> render());
      });
    }
    const alertExamFilter = document.getElementById('alertExamFilter');
    if(alertExamFilter){
      alertExamFilter.addEventListener('change', (e)=>{ state.alertExamFilter = e.target.value; render(); });
    }
    const alertTypeFilter = document.getElementById('alertTypeFilter');
    if(alertTypeFilter){
      alertTypeFilter.addEventListener('change', (e)=>{ state.alertTypeFilter = e.target.value; render(); });
    }
  }

  // Preserve caret position in a text input across a full re-render (since render() replaces innerHTML)
  function renderKeepingFocus(inputId, fn){
    const el = document.getElementById(inputId);
    const pos = el ? el.selectionStart : null;
    fn();
    const el2 = document.getElementById(inputId);
    if(el2 && pos !== null){ el2.focus(); try{ el2.setSelectionRange(pos,pos); }catch(e){} }
  }

  /* =========================================================
     SIDEBAR NAV + MOBILE DRAWER
  ========================================================== */
  document.getElementById('navGroup').querySelectorAll('.nav-item').forEach(el=>{
    el.addEventListener('click', ()=> navigate(el.dataset.nav));
  });

  function openMobileNav(){ document.body.classList.add('nav-open'); }
  function closeMobileNav(){ document.body.classList.remove('nav-open'); }
  document.getElementById('hamburgerBtn').addEventListener('click', openMobileNav);
  document.getElementById('scrim').addEventListener('click', closeMobileNav);

  /* =========================================================
     INIT
  ========================================================== */
  render();
})();
