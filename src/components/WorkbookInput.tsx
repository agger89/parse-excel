import React, { FunctionComponent, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import XLSX from 'xlsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  inputWrap: {
    display: 'inline-block',
    padding: '0 10px',
    marginBottom: '20px',
    border: '1px dashed #999',
    outline: 'none'
  }
})

function parseHeader(sheet: XLSX.WorkSheet, range: XLSX.Range, requiredColumns: string[]) {
  const columnNames: Array<string | null> = []

  for (let i = range.s.c; i <= range.e.c; ++i) {
    const cell = XLSX.utils.encode_cell({
      r: 0,
      c: i,
    })
    const value = sheet[cell]
    columnNames[i] = value ? '' + value.v : null
  }

  const missingColumns: string[] = []

  for (const column of requiredColumns) {
    if (columnNames.indexOf(column) === -1) {
      missingColumns.push(column)
    }
  }

  if (missingColumns.length > 0) {
    throw new Error(missingColumns.join(', '))
  }

  return columnNames
}

function parseBody(sheet: XLSX.WorkSheet, range: XLSX.Range, columnNames: Array<string | null>) {
  for (let i = range.s.c; i <= range.e.c; ++i) {
    const cell = XLSX.utils.encode_cell({
      r: 0,
      c: i,
    })
    const value = sheet[cell]
    columnNames[i] = value ? '' + value.v : null
  }

  const rows: any[] = []

  for (let i = 1; i <= range.e.r; ++i) {
    const row: any = {}

    for (let j = range.s.c; j <= range.e.c; ++j) {
      const cell = XLSX.utils.encode_cell({
        r: i,
        c: j,
      })
      const value = sheet[cell]
      const columnName = columnNames[j]
      if (typeof columnName === 'string') {
        row[columnName] = value ? value.v : null
      }
    }

    rows.push(row)
  }

  return rows
}

export function parseWorkbook(
  requiredColumns: string[],
  workbook: XLSX.WorkBook | null,
): any[] | null {
  if (!workbook) {
    return null
  }

  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]
  const ref = sheet['!ref']
  if (!ref) {
    return null
  }

  const range = XLSX.utils.decode_range(ref)
  const columnNames = parseHeader(sheet, range, requiredColumns)
  const rows = parseBody(sheet, range, columnNames)

  return rows
}

export interface WorkbookFile {
  name: string
  body: XLSX.WorkBook
}

interface WorkbookInputProps {
  value: WorkbookFile | null
  onChange: (workbook: WorkbookFile) => void
}

const WorkbookInput: FunctionComponent<WorkbookInputProps> = ({ value, onChange }) => {
  const classes = useStyles({})
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    const file = acceptedFiles[0]
    const reader = new FileReader()
      
    reader.onload = () => {
      const data = reader.result
      const workbook = XLSX.read(data, {
        type: 'binary',
        cellNF: true,
      })

      onChange({
        name: file.name,
        body: workbook,
      })
    }

    reader.readAsBinaryString(file)

  }, [onChange])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className={classes.inputWrap}>
      <input {...getInputProps()} />
      <p>{value ? `File: ${value.name}` : `Drag 'n' drop some files here, or click to select files`}</p>
    </div>
  );
}

export default WorkbookInput;
