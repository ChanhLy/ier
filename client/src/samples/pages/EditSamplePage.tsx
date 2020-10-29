import { Button, Form, Input, message, PageHeader, Select, Skeleton } from 'antd';
import { Store } from 'antd/lib/form/interface';
import confirm from 'antd/lib/modal/confirm';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Sample } from '..';
import { Experiment } from '../../experiments';
import { experimentColumns, ExperimentTable } from '../../experiments/components/ExperimentTable';
import { DELETE_EXPERIMENT, FAILURE, METHOD, SAMPLE, SAMPLE_ID, SUCCESS, TARGET } from '../../utils/constants';
import { SampleForm } from '../components/SampleForm';
import { methodOptions, targetOptions } from '../helpers/methods';

export function EditSamplePage() {
  const { id } = useParams<{ id: string }>();
  const [sample, setSample] = useState<Sample>();
  const history = useHistory();

  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);

  const { methods, target, actions } = experimentColumns({ onDelete: onDeleteExperiment, onEdit: onEditExperiment });

  useEffect(() => {
    if (!id) return;
    Axios.get('/api/samples/' + id).then((response) => {
      if (response?.data) {
        setSample(response.data);
      }
    });
  }, [id]);

  useEffect(() => {
    loadingExperiments &&
      Axios.get('/api/experiments', { params: { sample: id } }).then((response) => {
        if (response?.data) {
          setExperiments(response.data);
          setLoadingExperiments(false);
        }
      });
  }, [loadingExperiments, id]);

  return (
    <>
      <PageHeader title={SAMPLE} subTitle={id}></PageHeader>
      <div className='content'>
        {!sample ? (
          <Skeleton loading={true} />
        ) : (
          <div style={{ width: 800 }}>
            <SampleForm initialValues={sample} onFinish={onEditSample} />
            <Button onClick={onAddExperiment} type='primary'>
              
              Thêm thí nghiệm
            
            </Button>
            <ExperimentTable
              loading={loadingExperiments}
              experiments={experiments}
              onDelete={onDeleteExperiment}
              columns={[target, methods, actions]}
            />
          </div>
        )}
      </div>
    </>
  );

  async function onEditSample(values: Store) {
    Axios.put('/api/samples/' + id, values).finally(() => {
      history.push('/samples');
    });
  }

  function onAddExperiment() {
    const formId = 'AddExperimentForm';
    confirm({
      title: 'Thêm thí nghiệm',
      content: <ExperimentForm sample={sample} id={formId} onFinish={onFinishAddExperiment} />,
      okButtonProps: { form: formId, htmlType: 'submit', type: 'primary' },
      width: 1000,
    });

    function onFinishAddExperiment(values: Store) {
      Axios.post('/api/experiments', values)
        .then((response) => response && message.success(SUCCESS) && setLoadingExperiments(true))
        .catch((error) => message.error(FAILURE));
    }
  }

  function onEditExperiment(experiment: Experiment) {
    const formId = 'EditExperimentForm';
    confirm({
      title: 'Chỉnh sửa thí nghiệm ' + id,
      content: (
        <ExperimentForm sample={sample} initialValues={experiment} id={formId} onFinish={onFinishEditExperiment} />
      ),
      okButtonProps: { form: formId, htmlType: 'submit', type: 'primary' },
      width: 1000,
    });

    function onFinishEditExperiment(values: Store) {
      Axios.put('/api/experiments/' + experiment._id, values)
        .then((response) => response && message.success(SUCCESS) && setLoadingExperiments(true))
        .catch((error) => message.error(FAILURE));
    }
  }

  function onDeleteExperiment(experimentId: string | number) {
    confirm({
      title: DELETE_EXPERIMENT,
      onOk: () => {
        Axios.delete('/api/experiments/' + experimentId)
          .then((response) => {
            response && message.success(SUCCESS) && setLoadingExperiments(true);
          })
          .catch((error) => message.error(FAILURE));
      },
    });
  }
}

function ExperimentForm(props: {
  initialValues?: Experiment;
  sample?: Sample;
  id: string;
  onFinish: (values: Store) => void;
}) {
  const { initialValues: experiment, sample } = props;
  const [target, setTarget] = useState(experiment?.target || '');
  const [disabledSelectMethods, setDisabledSelectMethods] = useState(true);

  useEffect(() => {
    setDisabledSelectMethods(!target);
  }, [target]);

  return (
    <Form
      id={props.id}
      onFinish={props.onFinish}
      initialValues={{ ...experiment, sample: sample?._id }}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item label={SAMPLE_ID} name='sample'>
        <Input value={sample?._id} disabled={true} />
      </Form.Item>
      <Form.Item label={TARGET} name='target' rules={[{ required: true, message: 'Missing targets' }]}>
        <Select
          placeholder={TARGET}
          options={targetOptions(sample?.type)}
          onChange={(value: string) => setTarget(value)}
        />
      </Form.Item>
      <Form.Item label={METHOD} name={'methods'} wrapperCol={{ span: 12 }}>
        <Select
          mode='multiple'
          placeholder={METHOD}
          options={methodOptions(sample?.type, target)}
          disabled={disabledSelectMethods}
        />
      </Form.Item>
    </Form>
  );
}
