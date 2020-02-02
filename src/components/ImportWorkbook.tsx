import React, { useState, useMemo } from 'react';
import WorkbookInput, { WorkbookFile, parseWorkbook } from './WorkbookInput';
import WorkbookPreview from './WorkbookPreview'

// sample header
const HEADERS: string[] = ['user_id', '4일차 과제_1', '4일차 과제_2', '4일차 과제_3', '4일차 과제_4']

const ImportWorkbook = () => {

  const [workbook, setWorkbook] = useState<WorkbookFile | null>(null)

  const handleWorkbookChange = (workbook: WorkbookFile) => {
    setWorkbook(workbook)
  }

  const [rows] = useMemo(() => {
    try {
      const rows = parseWorkbook(HEADERS, workbook && workbook.body)
      return [rows, null]
    } catch (error) {
      return [null, error.message]
    }
  }, [workbook])

  return (
    <>
      <WorkbookInput 
        value={workbook}
        onChange={handleWorkbookChange}
      />
      {rows &&
        <WorkbookPreview workbookHeaders={HEADERS} workbookRows={rows} />
      }
    </>
  );
}

export default ImportWorkbook;
