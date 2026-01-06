import { Schema } from 'mongoose';
import { ISlider } from './slider.interface';
import { model } from 'mongoose';

const SliderSchema = new Schema<ISlider>(
     {
          name: {
               type: String,
               required: true,
          },
          link: {
               type: String,
          },
     },
     {
          timestamps: true,
     },
);

export const SliderModel = model<ISlider>('Slider', SliderSchema);
