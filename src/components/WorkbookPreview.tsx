import React, { FunctionComponent } from 'react'
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'

export interface WorkbookPreviewProps {
  workbookHeaders: any[]
  workbookRows: any
}

const WorkbookPreview: FunctionComponent<WorkbookPreviewProps> = ({
  workbookHeaders,
  workbookRows,
}) => {

  return (
    <Paper>
    <Table stickyHeader size="small" aria-label="sticky table">
      <TableHead>
        <TableRow>
        {console.log(workbookRows)}
          {workbookHeaders.map(header => (
            <TableCell key={header}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {console.log(workbookRows)}
        {workbookRows.map((row: { [x: string]: React.ReactNode; }, index: string | number | undefined) => (
          <TableRow key={index} >
            {workbookHeaders.map(header => (
              <TableCell
                component="th"
                scope="row"
                key={header}
              >
                {row[header]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </Paper>
  )
}

export default WorkbookPreview
