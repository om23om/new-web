import React from 'react';
import Tutors from './Tutors';
import Booking from './Booking';
import Articles from './Articles';
import Testimonials from './Testimonials';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Language Tutor</h1>
      <Tutors />
      <Booking />
      <Articles />
      <Testimonials />
    </div>
  );
};

export default Home;