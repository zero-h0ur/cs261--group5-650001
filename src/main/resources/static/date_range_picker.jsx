import React, { useState, useEffect } from 'react';

export default function DateRangePicker({ onApply } = {}) {
  // mode: 'single' or 'range'
  const [mode, setMode] = useState('single');
  // includeTime: if true, show time pickers and validate time too
  const [includeTime, setIncludeTime] = useState(false);

  // transient inputs
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [startTime, setStartTime] = useState('00:00'); // HH:mm
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');

  // applied state (what user clicked Apply)
  const [applied, setApplied] = useState(null);

  // derived validation
  const parseToDate = (dateStr, timeStr) => {
    if (!dateStr) return null;
    // create Date in local timezone
    const [y, m, d] = dateStr.split('-').map(Number);
    let h = 0, min = 0;
    if (includeTime && timeStr) {
      [h, min] = timeStr.split(':').map(Number);
    }
    return new Date(y, m - 1, d, h ?? 0, min ?? 0, 0, 0);
  };

  const startDateObj = parseToDate(startDate, startTime);
  const endDateObj = mode === 'range' ? parseToDate(endDate, endTime) : startDateObj;

  const isValidRange = () => {
    if (!startDateObj) return false;
    if (mode === 'single') return true; // single with a start date is valid
    if (!endDateObj) return false;
    return startDateObj.getTime() <= endDateObj.getTime();
  };

  const validationError = () => {
    if (!startDateObj) return 'กรุณาเลือกวันที่เริ่มต้น (Start date)';
    if (mode === 'range' && !endDateObj) return 'กรุณาเลือกวันที่สิ้นสุด (End date)';
    if (mode === 'range' && startDateObj && endDateObj && startDateObj.getTime() > endDateObj.getTime()) {
      return 'ช่วงเวลาไม่ถูกต้อง: Start > End';
    }
    return null;
  };

  // helpers to format
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const formatDate = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${y}-${m}-${day}`;
  };
  const formatTime = (d) => {
    if (!d) return '';
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const formatDateTime = (d) => {
    if (!d) return '';
    return `${formatDate(d)} ${formatTime(d)}`;
  };

  // Apply handler
  const handleApply = () => {
    if (!isValidRange()) return;
    const payload = {
      mode,
      includeTime,
      start: {
        date: formatDate(startDateObj),
        time: includeTime ? formatTime(startDateObj) : undefined,
        iso: includeTime ? `${formatDate(startDateObj)}T${formatTime(startDateObj)}` : formatDate(startDateObj),
      },
      end: null,
    };
    if (mode === 'range') {
      payload.end = {
        date: formatDate(endDateObj),
        time: includeTime ? formatTime(endDateObj) : undefined,
        iso: includeTime ? `${formatDate(endDateObj)}T${formatTime(endDateObj)}` : formatDate(endDateObj),
      };
    } else {
      payload.end = payload.start;
    }

    setApplied(payload);
    if (typeof onApply === 'function') onApply(payload);
  };

  const handleClear = () => {
    setStartDate('');
    setStartTime('00:00');
    setEndDate('');
    setEndTime('23:59');
    setApplied(null);
  };

  // when switching to single mode, copy start into end for consistency
  useEffect(() => {
    if (mode === 'single') {
      setEndDate('');
    }
  }, [mode]);

  // UI
  return (
    <div className="max-w-xl p-4 rounded-lg shadow-sm bg-white">
      <div className="flex gap-3 items-center mb-3">
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" value="single" checked={mode === 'single'} onChange={() => setMode('single')} />
          <span className="text-sm">เลือกวันเดียว</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" value="range" checked={mode === 'range'} onChange={() => setMode('range')} />
          <span className="text-sm">ช่วงวัน/เวลา</span>
        </label>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeTime} onChange={(e) => setIncludeTime(e.target.checked)} />
          <span>รวมเวลา (เวลา)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-xs mb-1">Start {includeTime ? '/ วันที่และเวลา' : '/ วันที่'}</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 grow"
            />
            {includeTime && (
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded px-2 py-1 w-28"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">End {mode === 'single' ? '(auto = Start)' : includeTime ? '/ วันที่และเวลา' : '/ วันที่'}</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={mode === 'single' ? endDate : endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={mode === 'single'}
              className="border rounded px-2 py-1 grow"
            />
            {includeTime && (
              <input
                type="time"
                value={mode === 'single' ? endTime : endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={mode === 'single'}
                className="border rounded px-2 py-1 w-28"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-600">
          {validationError() ? <span className="text-red-600">{validationError()}</span> : <span>ค่า: {startDate ? formatDate(startDateObj) : '-'}{includeTime && startDate ? ` ${formatTime(startDateObj)}` : ''}{mode === 'range' ? ` → ${endDate ? formatDate(endDateObj) : '-'}${includeTime && endDate ? ` ${formatTime(endDateObj)}` : ''}` : ''}</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"
            type="button"
          >
            ล้าง
          </button>
          <button
            onClick={handleApply}
            disabled={!isValidRange()}
            className={`px-3 py-1 rounded text-sm font-medium ${isValidRange() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            type="button"
          >
            Apply / Filter
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-500 mb-1">ผลการเลือก (formatted and stored in state):</div>
        {applied ? (
          <div className="bg-gray-50 border rounded p-2 text-sm">
            <div><strong>Mode:</strong> {applied.mode}</div>
            <div className="mt-1"><strong>Start:</strong> {applied.start.date}{applied.start.time ? ` ${applied.start.time}` : ''}</div>
            <div className="mt-1"><strong>Start (ISO):</strong> {applied.start.iso}</div>
            <div className="mt-1"><strong>End:</strong> {applied.end.date}{applied.end.time ? ` ${applied.end.time}` : ''}</div>
            <div className="mt-1"><strong>End (ISO):</strong> {applied.end.iso}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">ยังไม่ได้กด Apply</div>
        )}
      </div>

    </div>
  );
}
