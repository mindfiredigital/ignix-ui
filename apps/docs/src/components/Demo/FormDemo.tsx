import React, { useState } from 'react';
import { Form, FormField, InputWrapper } from '@site/src/components/UI/form';
import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const spacingOptions = [
  { value: 'tight', label: 'Tight' },
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'relaxed', label: 'Relaxed' },
];

const labelOptions = [
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'floating', label: 'Floating' },
];



const maxWidthOptions = [
  { value: 'readable', label: 'Readable' },
  { value: 'content', label: 'Content' },
  { value: 'prose', label: 'Prose' },
  { value: 'container', label: 'Container' },
  { value: 'none', label: 'None' },
];

const columnOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];

const FormDemo = () => {
  const [spacing, setSpacing] = useState<'tight' | 'compact' | 'comfortable' | 'relaxed'>('comfortable');
  const [labels, setLabels] = useState<'top' | 'left' | 'floating'>('top');
  const [maxWidth, setMaxWidth] = useState<'readable' | 'content' | 'prose' | 'container' | 'none'>('readable');
  const [showAllFields, setShowAllFields] = useState(false);
  const [columns, setColumns] = useState<{
    desktop?: number;
    tablet?: number;
    mobile?: number;
  }>({
    desktop: 2,
    tablet: 1,
    mobile: 1,
  });

  const codeString = `import { Form, FormField, InputWrapper } from './components/ui/form';
import { Button } from './components/ui/button';

function ContactForm() {
  return (
    <Form 
      columns={{
        desktop: ${columns.desktop ?? 1},
        tablet: ${columns.tablet ?? 1},
        mobile: ${columns.mobile ?? 1}
      }}
      spacing="${spacing}"
      labels="${labels}"
      maxWidth="${maxWidth}"
    >
      {/* Text Input */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="firstName"
            type="text"
            placeholder=" "
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
          />
          <label htmlFor="firstName">First Name</label>
        </InputWrapper>` 
          : `<label htmlFor="firstName">First Name</label>
        <InputWrapper>
          <input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </InputWrapper>`}
      </FormField>
      
      {/* Email Input */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="email"
            type="email"
            placeholder=" "
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
          />
          <label htmlFor="email">Email Address</label>
        </InputWrapper>` 
          : `<label htmlFor="email">Email Address</label>
        <InputWrapper>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </InputWrapper>`}
      </FormField>

      ${showAllFields ? `
      {/* Password Input */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="password"
            type="password"
            placeholder=" "
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
          />
          <label htmlFor="password">Password</label>
        </InputWrapper>` 
          : `<label htmlFor="password">Password</label>
        <InputWrapper>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </InputWrapper>`}
      </FormField>

      {/* Date Input */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="birthDate"
            type="date"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
          />
          <label htmlFor="birthDate">Birth Date</label>
        </InputWrapper>` 
          : `<label htmlFor="birthDate">Birth Date</label>
        <InputWrapper>
          <input
            id="birthDate"
            type="date"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </InputWrapper>`}
      </FormField>

      {/* Number Input */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="age"
            type="number"
            min="1"
            max="120"
            placeholder=" "
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
          />
          <label htmlFor="age">Age</label>
        </InputWrapper>` 
          : `<label htmlFor="age">Age</label>
        <InputWrapper>
          <input
            id="age"
            type="number"
            min="1"
            max="120"
            placeholder="Enter your age"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </InputWrapper>`}
      </FormField>

      {/* Phone Input */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="phone"
            type="tel"
            placeholder=" "
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
          />
          <label htmlFor="phone">Phone Number</label>
        </InputWrapper>` 
          : `<label htmlFor="phone">Phone Number</label>
        <InputWrapper>
          <input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </InputWrapper>`}
      </FormField>

      {/* File Upload */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          <label htmlFor="avatar">Profile Picture</label>
        </InputWrapper>` 
          : `<label htmlFor="avatar">Profile Picture</label>
        <InputWrapper>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
          />
        </InputWrapper>`}
      </FormField>

      {/* Select Dropdown */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <select
            id="country"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
          >
            <option value="">Select country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
          </select>
          <label htmlFor="country">Country</label>
        </InputWrapper>` 
          : `<label htmlFor="country">Country</label>
        <InputWrapper>
          <select
            id="country"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
          >
            <option value="">Select country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
          </select>
        </InputWrapper>`}
      </FormField>

      {/* Checkbox Group */}
      <FormField className="${(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}">
        <label className="text-sm font-medium">Interests</label>
        <InputWrapper>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" value="technology" className="rounded" />
              <span>Technology</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" value="sports" className="rounded" />
              <span>Sports</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" value="music" className="rounded" />
              <span>Music</span>
            </label>
          </div>
        </InputWrapper>
      </FormField>

      {/* Radio Button Group */}
      <FormField className="${(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}">
        <label className="text-sm font-medium">Gender</label>
        <InputWrapper>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="male" />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="female" />
              <span>Female</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="other" />
              <span>Other</span>
            </label>
          </div>
        </InputWrapper>
      </FormField>

      {/* Range Slider */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="experience"
            type="range"
            min="0"
            max="20"
            defaultValue="5"
            className="w-full"
          />
          <label htmlFor="experience">Years of Experience</label>
        </InputWrapper>` 
          : `<label htmlFor="experience">Years of Experience</label>
        <InputWrapper>
          <input
            id="experience"
            type="range"
            min="0"
            max="20"
            defaultValue="5"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>20+ years</span>
          </div>
        </InputWrapper>`}
      </FormField>

      {/* Color Picker */}
      <FormField>
        ${labels === 'floating' 
          ? `<InputWrapper>
          <input
            id="favoriteColor"
            type="color"
            defaultValue="#3b82f6"
            className="w-full h-10 border rounded-md cursor-pointer"
          />
          <label htmlFor="favoriteColor">Favorite Color</label>
        </InputWrapper>` 
          : `<label htmlFor="favoriteColor">Favorite Color</label>
        <InputWrapper>
          <input
            id="favoriteColor"
            type="color"
            defaultValue="#3b82f6"
            className="w-full h-10 border rounded-md cursor-pointer"
          />
        </InputWrapper>`}
      </FormField>` : ''}
      
      {/* Textarea */}
      <FormField className="${(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}">
        ${labels === 'floating' 
          ? `<InputWrapper>
          <textarea
            id="message"
            rows={4}
            placeholder=" "
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none peer"
          />
          <label htmlFor="message">Message</label>
        </InputWrapper>` 
          : `<label htmlFor="message">Message</label>
        <InputWrapper>
          <textarea
            id="message"
            rows={4}
            placeholder="Enter your message"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </InputWrapper>`}
      </FormField>
      
      <div className="${(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''} flex gap-2">
        <Button variant="default">Submit</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </Form>
  );
}`;

  const renderFormField = (id: string, label: string, type = 'text', isTextarea = false, ) => {
    if (labels === 'floating') {
      return (
        <FormField key={id} className={isTextarea && (columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}>
          <InputWrapper>
            {isTextarea ? (
              <textarea
                id={id}
                rows={4}
                placeholder=" "
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none peer"
              />
            ) : type === 'file' ? (
              <input
                id={id}
                type={type}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            ) : type === 'color' ? (
              <input
                id={id}
                type={type}
                defaultValue="#3b82f6"
                className="w-full h-10 border rounded-md cursor-pointer"
              />
            ) : type === 'range' ? (
              <input
                id={id}
                type={type}
                min="0"
                max="20"
                defaultValue="5"
                className="w-full"
              />
            ) : type === 'date' ? (
              <input
                id={id}
                type={type}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
              />
            ) : type === 'number' ? (
              <input
                id={id}
                type={type}
                min="1"
                max="120"
                placeholder=" "
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
              />
            ) : type === 'select' ? (
              <select
                id={id}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
              >
                <option value="">Select country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
              </select>
            ) : (
              <input
                id={id}
                type={type}
                placeholder=" "
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer"
              />
            )}
            <label htmlFor={id}>{label}</label>
          </InputWrapper>
        </FormField>
      );
    } else {
      return (
        <FormField key={id} className={isTextarea && (columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}>
          <label htmlFor={id}>{label}</label>
          <InputWrapper>
            {isTextarea ? (
              <textarea
                id={id}
                rows={4}
                placeholder={`Enter your ${label.toLowerCase()}`}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            ) : type === 'file' ? (
              <input
                id={id}
                type={type}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            ) : type === 'color' ? (
              <input
                id={id}
                type={type}
                defaultValue="#3b82f6"
                className="w-full h-10 border rounded-md cursor-pointer"
              />
            ) : type === 'range' ? (
              <div>
                <input
                  id={id}
                  type={type}
                  min="0"
                  max="20"
                  defaultValue="5"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>20+ years</span>
                </div>
              </div>
            ) : type === 'date' ? (
              <input
                id={id}
                type={type}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ) : type === 'number' ? (
              <input
                id={id}
                type={type}
                min="1"
                max="120"
                placeholder={`Enter your ${label.toLowerCase()}`}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ) : type === 'select' ? (
              <select
                id={id}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
              >
                <option value="">Select country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
              </select>
            ) : (
              <input
                id={id}
                type={type}
                placeholder={`Enter your ${label.toLowerCase()}`}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          </InputWrapper>
        </FormField>
      );
    }
  };

  const renderSpecialFields = () => {
    if (!showAllFields) return null;

    return (
      <>
        {/* Checkbox Group */}
        <FormField className={(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}>
          <label className="text-sm font-medium">Interests</label>
          <InputWrapper>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" value="technology" className="rounded" />
                <span>Technology</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" value="sports" className="rounded" />
                <span>Sports</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" value="music" className="rounded" />
                <span>Music</span>
              </label>
            </div>
          </InputWrapper>
        </FormField>

        {/* Radio Button Group */}
        <FormField className={(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''}>
          <label className="text-sm font-medium">Gender</label>
          <InputWrapper>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="male" />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="female" />
                <span>Female</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="other" />
                <span>Other</span>
              </label>
            </div>
          </InputWrapper>
        </FormField>
      </>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <VariantSelector
          variants={spacingOptions.map(s => s.value)}
          selectedVariant={spacing}
          onSelectVariant={(val) => setSpacing(val as typeof spacing)}
          type="Spacing"
        />
        <VariantSelector
          variants={labelOptions.map(l => l.value)}
          selectedVariant={labels}
          onSelectVariant={(val) => setLabels(val as typeof labels)}
          type="Labels"
        />
        <VariantSelector
          variants={maxWidthOptions.map(m => m.value)}
          selectedVariant={maxWidth}
          onSelectVariant={(val) => setMaxWidth(val as typeof maxWidth)}
          type="Max Width"
        />
        <VariantSelector
          variants={columnOptions.map(c => c.value)}
          selectedVariant={columns.desktop?.toString() ?? '1'}
          onSelectVariant={(val) => setColumns(c => ({ ...c, desktop: parseInt(val) }))}
          type="Desktop Columns"
        />
        <VariantSelector
          variants={columnOptions.map(c => c.value)}
          selectedVariant={columns.mobile?.toString() ?? '1'}
          onSelectVariant={(val) => setColumns(c => ({ ...c, mobile: parseInt(val) }))}
          type="Mobile Columns"
        />
      </div>

      <div className="flex justify-center mb-4">
        <Button
          variant={showAllFields ? "default" : "outline"}
          onClick={() => setShowAllFields(!showAllFields)}
        >
          {showAllFields ? "Show Basic Fields" : "Show All Field Types"}
        </Button>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4">
            <Form 
              columns={columns}
              spacing={spacing}
              labels={labels}
              maxWidth={maxWidth}
            >
              {renderFormField('firstName', 'First Name', 'text')}
              {renderFormField('email', 'Email Address', 'email')}
              
              {showAllFields && (
                <>
                  {renderFormField('password', 'Password', 'password')}
                  {renderFormField('birthDate', 'Birth Date', 'date')}
                  {renderFormField('age', 'Age', 'number')}
                  {renderFormField('phone', 'Phone Number', 'tel')}
                  {renderFormField('avatar', 'Profile Picture', 'file')}
                  {renderFormField('country', 'Country', 'select')}
                  {renderSpecialFields()}
                  {renderFormField('experience', 'Years of Experience', 'range')}
                  {renderFormField('favoriteColor', 'Favorite Color', 'color')}
                </>
              )}
              
              {renderFormField('message', 'Message', 'text', true)}
              
              <div className={`${(columns.desktop && columns.desktop > 1) ? `md:col-span-${columns.desktop}` : ''} flex gap-2`}>
                <Button variant="default">Submit</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </Form>
          </div>
        </TabItem>

        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default FormDemo;