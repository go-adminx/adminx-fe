import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Select } from 'antd';
import request from 'umi-request';
import debounce from "lodash/debounce";
import snakeCase from 'lodash/snakeCase';

const { Option } = Select;

export const Link: React.FC<ISchemaFieldComponentProps> = props => {
  const [searchResult, setSearchResult] = useState<{ [key: string]: any }[]>([]);
  const { schema, mutators, value } = props;
  const { placeholder, style, multiple, configID, linkValueField } = schema['x-component-props'] || {};
  const optKey = snakeCase(linkValueField);

  const onSearch = (val: string) => {
    if (val) {
      request('/api/client/linksearch', {
        method: 'get',
        headers: {
          'Authorization': localStorage.getItem('X-AdminX-Token') || '',
        },
        params: {
          txt: val, configID
        }
      })
        .then(function(response: {data: {label: string, value: any}[]}) {
          const { data = [] } = response;
          if (data && data.length) {
            const opts = data.map(item => {
              let opt = {label: item.label};
              opt[optKey] = item.value;
              return opt;
            });
            setSearchResult(opts);
          } else {
            setSearchResult([]);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      setSearchResult([]);
    }
  };

  const initOptions = (val: any) => {
    if (val) {
      if (multiple) {
        if (typeof val === "string") {
          val = JSON.parse(val);
        }
        val = val.map((v: { [x: string]: any; }) => {
          return v[optKey];
        }).join(",");
      }
      request('/api/client/linkget', {
        method: 'get',
        headers: {
          'Authorization': localStorage.getItem('X-AdminX-Token') || '',
        },
        params: {
          val, configID
        }
      })
        .then(function(response: {data: {label: string, value: any}[]}) {
          const { data = [] } = response;
          if (data && data.length) {
            const opts = data.map(item => {
              let opt = {label: item.label};
              opt[optKey] = item.value;
              return opt;
            });
            setSearchResult(opts);
          } else {
            setSearchResult([]);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      setSearchResult([]);
    }
  };

  const onChange = (newVal: any) => {
    if (multiple) {
      mutators.change(newVal.map((nv: any) => {
        let obj = {};
        obj[optKey] = nv;
        return obj;
      }));
    } else {
      mutators.change(newVal);
    }
  };

  useEffect(() => {
    initOptions(value);
  }, [value]);

  return (
    <Select
      showSearch
      mode={multiple ? "multiple" : undefined}
      allowClear={true}
      value={value ? (multiple ? (value.map((v: { [x: string]: any; }) => String(v[optKey]))) : String(value)) : value}
      placeholder={placeholder || "Search..."}
      style={style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={debounce(onSearch, 500)}
      onChange={onChange}
      notFoundContent="No Data"
    >
      {searchResult.map(d => <Option key={d[optKey]} value={d[optKey]}>{d.label}</Option>)}
    </Select>
  );
};

export default Link;
