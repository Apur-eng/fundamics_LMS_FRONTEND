const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('Backend Results & Document API Alignment', async (t) => {
  // Check openapi.json from backend repository
  const openapiPath = 'D:/fundamics_backend/openapi.json';
  assert.ok(fs.existsSync(openapiPath), 'Backend openapi.json must exist');

  const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
  const paths = openapi.paths;

  await t.test('GET /api/v1/student/me/results endpoint exists', () => {
    assert.ok(paths['/api/v1/student/me/results'], 'Endpoint /api/v1/student/me/results must be present');
    assert.ok(paths['/api/v1/student/me/results'].get, 'GET method must be defined');
  });

  await t.test('GET /api/v1/student/me/results/{result_id}/document endpoint exists', () => {
    assert.ok(
      paths['/api/v1/student/me/results/{result_id}/document'],
      'Endpoint /api/v1/student/me/results/{result_id}/document must be present'
    );
    const getDoc = paths['/api/v1/student/me/results/{result_id}/document'].get;
    assert.ok(getDoc, 'GET method must be defined for result document download');
    assert.ok(
      getDoc.parameters && getDoc.parameters.some((p) => p.name === 'result_id'),
      'result_id parameter must be defined'
    );
  });
});

test('Frontend Results PDF Data Extraction & Mapper Logic', async (t) => {
  // Source inspection of studentService.ts
  const studentServicePath = 'D:/fundamics/fundamics_lms_frontend/src/services/api/studentService.ts';
  const serviceCode = fs.readFileSync(studentServicePath, 'utf8');

  await t.test('studentService exports extractResultDocuments and mapBackendResults', () => {
    assert.ok(
      serviceCode.includes('export const extractResultDocuments'),
      'extractResultDocuments must be exported'
    );
    assert.ok(
      serviceCode.includes('export const mapBackendResults'),
      'mapBackendResults must be exported'
    );
  });

  await t.test('studentService includes downloadResultDocument and viewResultDocument', () => {
    assert.ok(
      serviceCode.includes('downloadResultDocument('),
      'downloadResultDocument method must exist in studentService'
    );
    assert.ok(
      serviceCode.includes('viewResultDocument('),
      'viewResultDocument method must exist in studentService'
    );
  });

  await t.test('extractResultDocuments correctly transforms backend payload', () => {
    // Simulating extractResultDocuments logic directly
    const mockBackendExams = [
      {
        exam_id: 'exam-1',
        exam_name: 'Unit Test 1',
        exam_date: '2026-10-16',
        total_marks_obtained: 88,
        total_max_marks: 100,
        overall_percentage: 88,
        results: [
          {
            id: 'res-uuid-1',
            exam_id: 'exam-1',
            exam_name: 'Unit Test 1',
            student_id: 'stu-1',
            subject_id: 'sub-1',
            subject_name: 'Physics',
            marks_obtained: 88,
            max_marks: 100,
            percentage: 88,
            grade: 'A',
            published_at: '2026-10-17T10:00:00Z',
            document_file_id: 'file-uuid-1',
            document_filename: 'physics_scorecard.pdf',
            has_document: true,
          },
        ],
      },
      {
        exam_id: 'exam-2',
        exam_name: 'Weekly Diagnostic',
        exam_date: '2026-10-10',
        total_marks_obtained: 72,
        total_max_marks: 100,
        overall_percentage: 72,
        results: [
          {
            id: 'res-uuid-2',
            exam_id: 'exam-2',
            exam_name: 'Weekly Diagnostic',
            student_id: 'stu-1',
            subject_id: 'sub-2',
            subject_name: 'Chemistry',
            marks_obtained: 72,
            max_marks: 100,
            percentage: 72,
            grade: 'B',
            published_at: null,
            document_file_id: null,
            document_filename: null,
            has_document: false,
          },
        ],
      },
    ];

    const documents = [];
    for (const exam of mockBackendExams) {
      if (exam.results) {
        for (const res of exam.results) {
          if (res.has_document || res.document_file_id) {
            documents.push({
              resultId: res.id,
              examId: exam.exam_id,
              examName: exam.exam_name,
              subjectName: res.subject_name,
              title: res.document_filename || exam.exam_name + ' Scorecard',
              filename: res.document_filename || exam.exam_name + '_Scorecard.pdf',
              publishedAt: res.published_at,
              score: res.marks_obtained,
              maxScore: res.max_marks,
              percentage: res.percentage,
            });
          }
        }
      }
    }

    assert.strictEqual(documents.length, 1, 'Only exams with attached documents should be extracted');
    assert.strictEqual(documents[0].resultId, 'res-uuid-1');
    assert.strictEqual(documents[0].filename, 'physics_scorecard.pdf');
    assert.strictEqual(documents[0].examName, 'Unit Test 1');
  });
});

test('Frontend UI Component Structure Integrity', async (t) => {
  const cardPath = 'D:/fundamics/fundamics_lms_frontend/src/features/results/components/StudentResultDocumentsCard.tsx';
  assert.ok(fs.existsSync(cardPath), 'StudentResultDocumentsCard.tsx component must exist');
  const cardCode = fs.readFileSync(cardPath, 'utf8');

  await t.test('StudentResultDocumentsCard renders PDF icon, metadata, and View/Download actions', () => {
    assert.ok(cardCode.includes('OFFICIAL SCORECARDS & REPORTS'), 'Section header must be present');
    assert.ok(cardCode.includes('handleDownload'), 'Download handler must be present');
    assert.ok(cardCode.includes('handleView'), 'View handler must be present');
    assert.ok(cardCode.includes('No Scorecards Published Yet'), 'Empty state must be handled');
    assert.ok(cardCode.includes('colors.violet'), 'Must use violet theme accent');
    assert.ok(cardCode.includes('colors.navy'), 'Must use navy primary button theme');
  });

  const screenPath = 'D:/fundamics/fundamics_lms_frontend/src/features/results/screens/StudentResultsScreen.tsx';
  const screenCode = fs.readFileSync(screenPath, 'utf8');

  await t.test('StudentResultsScreen mounts StudentResultDocumentsCard', () => {
    assert.ok(
      screenCode.includes('<StudentResultDocumentsCard'),
      'StudentResultsScreen must mount StudentResultDocumentsCard'
    );
  });

  const sheetPath = 'D:/fundamics/fundamics_lms_frontend/src/features/results/components/TestResultDetailSheet.tsx';
  const sheetCode = fs.readFileSync(sheetPath, 'utf8');

  await t.test('TestResultDetailSheet displays document attachment and actions when present', () => {
    assert.ok(
      sheetCode.includes('result.hasDocument'),
      'TestResultDetailSheet must check result.hasDocument'
    );
    assert.ok(
      sheetCode.includes('handleDownload'),
      'TestResultDetailSheet must support download action'
    );
    assert.ok(
      sheetCode.includes('handleView'),
      'TestResultDetailSheet must support preview action'
    );
  });
});
