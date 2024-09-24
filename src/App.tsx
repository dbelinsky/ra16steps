import { useState } from 'react'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, CloseButton, Form, Table } from 'react-bootstrap'

interface IDataObject {
  date: Date,
  duration: number
}

function App() {
  const [objArr, setData] = useState<IDataObject[]>([])

  const addData = (data: IDataObject) => {
    objArr.push(data)
    objArr.sort((el1, el2) => el2.date.getTime() - el1.date.getTime())
    setData([...objArr])
  }

  const changeData = (data: IDataObject) => {
    setData(objArr
      .map(el =>
        el.date.getTime() === data.date.getTime()
        ? {date: data.date, duration: data.duration + el.duration}
        : el)
      .sort((el1, el2) => el2.date.getTime() - el1.date.getTime()))
  }

  const deleteData = (data: IDataObject) => {
    setData(objArr.filter(el => el.date !== data.date))
  }


  const onSubmit = (e: React.BaseSyntheticEvent) => {

    e.preventDefault();
    const data = new FormData(e.target)
    const date: FormDataEntryValue | null = data.get('date')
    const durationString: FormDataEntryValue | null = data.get('duration')

    if (typeof date !== 'string' || typeof durationString !== 'string') {
      return
    }

    const durationNumber = durationString ? parseInt(durationString) : 0

    const dataObject: IDataObject = {
      date: new Date(new Date(date).toLocaleString()),
      duration: durationNumber
    }

    if(objArr.findIndex(el => el.date.getTime() === dataObject.date.getTime()) === -1) {
      addData(dataObject)
    } else {
      changeData(dataObject);
    }
    e.target.reset()
  }

  return (
    <>
     <Form
      onSubmit={onSubmit}
      className='m-4'
      name='form'
      style={{display: 'flex', justifyContent: 'space-between', width: '70%'}}
      >
      <Form.Group className="mb-1" controlId="formBasicDate">
        <Form.Label>Дата (ДД.ММ.ГГ)</Form.Label>
        <Form.Control name='date' type='text' pattern='\d{2}\.\d{2}\.\d{4}' required></Form.Control>
      </Form.Group>
      <Form.Group className="mb-1" controlId="formBasicDuration">
        <Form.Label>Пройдено км</Form.Label>
        <Form.Control  name='duration' type='text' pattern='\d+' required></Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit" className="mb-1" style={{height: '100%', alignSelf: 'flex-end'}}>
        OK
      </Button>
     </Form>

     <Table striped  hover variant="dark" size='sm' responsive>
        <thead>
          <tr>
            <th>Дата (ДД.ММ.ГГ)</th>
            <th>Пройдено км</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {objArr.map((el) => (
            <tr key={el.date.getTime()}>
              <td>{el.date.toLocaleDateString()}</td>
              <td>{el.duration}</td>
              {/*как нижеследующая кнопка здесь смогла привязаться к элементу? Не понял совсем*/}
              <td><CloseButton variant='white'  aria-label="Hide" onClick={() => deleteData(el)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>

   </>
  )
}

export default App
