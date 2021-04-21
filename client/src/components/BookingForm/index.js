import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  DatePicker,
  TimePicker,
  Result,
  Alert,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import Image from '../common/Image';
import './style.css';
import Hours from './Hours';
import bookingFormImage from '../../assets/images/undraw_Booking_re_gw4j.svg';

const { Title } = Typography;

const BookingForm = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeAppear, setTimeAppear] = useState(true);
  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState();

  const disabledDate = (current) =>
    current && current < moment().startOf('day');

  const onDateTrigger = async ({ appointmentDate }) => {
    if (appointmentDate) {
      const {
        data: { data: availableTimes },
      } = await axios.get(
        `/api/v1/appointments/available/${moment(appointmentDate).format(
          'YYYY-MM-DD'
        )}`
      );
      setTimeAppear(false);
      setAvailableHours(
        Hours.filter((hour) => !availableTimes.includes(hour)).map(
          (hour) => +hour.split(':')[0]
        )
      );
    }
  };

  const onFinish = async ({
    firstName,
    lastName,
    email,
    birthday,
    phone,
    diseases,
    appointmentDate,
    appointmentTime,
    complaints,
  }) => {
    try {
      setLoading(true);
      await axios.post('/api/v1/appointments', {
        firstName,
        lastName,
        email,
        birthday: moment(birthday).format('YYYY-MM-DD'),
        phone,
        diseases,
        appointmentDate: moment(appointmentDate).format('YYYY-MM-DD'),
        appointmentTime: moment(appointmentTime).format('HH:mm:ss'),
        complaints,
      });
      setSuccess(true);
      setError(false);
      setLoading(false);
      setTimeAppear(true);
    } catch (err) {
      setLoading(false);
      let e;
      if (err.response.data.error === 'Unavailable Time') {
        e = 'please choose another appointment time';
      } else if (err.response.data.error === 'Validation Error') {
        e = err.response.data.message;
      } else {
        e = 'Sever error, please try again later';
      }
      setError(e);
    }
  };

  return (
    <div className="booking" id="booking-form">
      {success ? (
        <div className="success">
          <Result status="success" title="Booked successfully" />
          <Button
            value={success}
            type="primary"
            onClick={() => setSuccess(false)}
          >
            Book again
          </Button>
        </div>
      ) : (
        <div className="booking-form-form-container">
          <Form
            onFinish={onFinish}
            onValuesChange={onDateTrigger}
            name="basic"
            className="booking-form-form"
          >
            <Title level={3} className="booking-form-title">
              Book an appointment
            </Title>
            {error && (
              <Alert
                className="err"
                id="alert"
                message={error}
                type="error"
                showIcon
              />
            )}
            <div className="booking-form-row">
              <Form.Item
                className="booking-form-item"
                name="firstName"
                rules={[
                  { required: true, message: 'Please input first Name!' },
                ]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
              <Form.Item
                className="booking-form-item"
                name="lastName"
                rules={[{ required: true, message: 'Please input last name!' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </div>
            <div className="booking-form-row">
              <Form.Item
                className="booking-form-item"
                name="email"
                rules={[{ type: 'email' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                className="booking-form-item"
                name="birthday"
                placeholder="Birthday"
              >
                <DatePicker placeholder="Birthday" />
              </Form.Item>
            </div>

            <Form.Item
              className="booking-form-item-phone"
              name="phone"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                {
                  pattern: /^[0-9-]*[0-9].{9,}$/,
                  message: 'Invalid phone number',
                },
              ]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
            <div className="booking-form-row">
              <Form.Item
                className="booking-form-item item-appointment-date"
                name="appointmentDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input your appointment date!',
                  },
                ]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  placeholder="Appointment date"
                />
              </Form.Item>

              <Form.Item
                className="booking-form-item"
                name="appointmentTime"
                rules={[
                  {
                    required: true,
                    message: 'Please input appointment time!',
                  },
                ]}
              >
                <TimePicker
                  disabled={timeAppear}
                  placeholder="Appointment time"
                  format="HH"
                  disabledHours={() => [...availableHours]}
                  hideDisabledOptions
                  showNow={false}
                />
              </Form.Item>
            </div>
            <div className="booking-form-row">
              <Form.Item name="diseases" className="booking-form-item">
                <Input.TextArea
                  placeholder="Do you have any chronic diseases ?"
                  className="input-height"
                />
              </Form.Item>
              <Form.Item className="booking-form-item" name="complaints">
                <Input.TextArea
                  placeholder="What are you suffering from ?"
                  className="input-height"
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Confirm
              </Button>
            </Form.Item>
          </Form>
          <div className="booking-form-image-container">
            <Image
              src={bookingFormImage}
              alt=""
              className="booking-form-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
