import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from '../components/radix/Button';
import { FormField } from '../components/radix/FormField';
import { Input } from '../components/radix/Input';
import { useLocalizedLink } from '../hooks/useLocalizedLink';
import { usePage } from '../hooks/api/usePagesApi';
import { updatePage } from '../hooks/api/usePagesApi';
import { usePageTypes } from '../hooks/api/usePageTypesApi';
import { toast } from 'react-toastify';
import './PageFormPage.scss';

interface EditPageFormData {
  pageTypeId: number;
  name: string;
  description?: string;
  path: string;
  index: number;
}

export function EditPagePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const getLocalizedPath = useLocalizedLink();
  const queryClient = useQueryClient();

  const pageId = id ? parseInt(id, 10) : 0;
  const { data: page, isLoading, error } = usePage(pageId);
  const { data: pageTypes = [], isLoading: pageTypesLoading } = usePageTypes();

  // Validation schema
  const validationSchema = yup.object({
    pageTypeId: yup
      .number()
      .required(t('pages.editPage.validation.pageTypeIdRequired'))
      .positive(t('pages.editPage.validation.pageTypeIdRequired')),
    name: yup
      .string()
      .required(t('pages.editPage.validation.nameRequired'))
      .max(200, t('pages.editPage.validation.nameMaxLength')),
    description: yup
      .string()
      .optional()
      .max(1000, t('pages.editPage.validation.descriptionMaxLength')),
    path: yup
      .string()
      .required(t('pages.editPage.validation.pathRequired'))
      .max(500, t('pages.editPage.validation.pathMaxLength')),
    index: yup
      .number()
      .required(t('pages.editPage.validation.indexRequired'))
      .min(0, t('pages.editPage.validation.indexMin')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditPageFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      path: '',
      index: 0,
    },
  });

  // Reset form when page data loads
  useEffect(() => {
    if (page) {
      reset({
        pageTypeId: page.pageTypeId || pageTypes[0]?.id || 0,
        name: page.name || '',
        description: page.description || '',
        path: page.path || '',
        index: page.index || 0,
      });
    }
  }, [page, pageTypes, reset]);

  const updatePageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EditPageFormData> }) =>
      updatePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', pageId] });
      if (page) {
        queryClient.invalidateQueries({ queryKey: ['face', page.faceId] });
      }
      toast.success(t('pages.editPage.success'));
      if (page) {
        navigate(getLocalizedPath(`/faces/${page.faceId}`));
      } else {
        navigate(getLocalizedPath('/faces'));
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || t('pages.editPage.error'));
    },
  });

  const onSubmit = async (data: EditPageFormData) => {
    if (!pageId) return;
    updatePageMutation.mutate({ id: pageId, data });
  };

  if (isLoading) {
    return (
      <div
        className="page-form-page-wrapper"
        style={{
          marginLeft: 'var(--sidebar-width, 250px)',
          padding: '2rem',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Container fluid>
          <div className="page-form-loading">
            <p>{t('pages.editPage.loading')}</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div
        className="page-form-page-wrapper"
        style={{
          marginLeft: 'var(--sidebar-width, 250px)',
          padding: '2rem',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Container fluid>
          <div className="page-form-error">
            <p>{t('pages.editPage.error')}</p>
            <Button onClick={() => navigate(getLocalizedPath('/faces'))}>{t('common.back')}</Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="page-form-page-wrapper"
      style={{
        marginLeft: 'var(--sidebar-width, 250px)',
        padding: '2rem',
        transition: 'margin-left 0.3s ease',
      }}
    >
      <Container fluid>
        <div className="page-form-content">
          <div className="page-form-header">
            <Button
              variant="outline"
              onClick={() => navigate(getLocalizedPath(`/faces/${page.faceId}`))}
              className="back-button"
            >
              ← {t('common.back')}
            </Button>
            <h1>{t('pages.editPage.title')}</h1>
          </div>

          <div className="page-form-card">
            <form onSubmit={handleSubmit(onSubmit)} className="page-form">
              <Row>
                <Col xs={12} md={6}>
                  <FormField
                    label={t('pages.editPage.pageType')}
                    error={errors.pageTypeId?.message}
                    required
                  >
                    <select
                      {...register('pageTypeId', { valueAsNumber: true })}
                      className="form-select"
                      disabled={isSubmitting || pageTypesLoading}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '1rem',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: '0.25rem',
                      }}
                    >
                      {pageTypesLoading ? (
                        <option>Loading...</option>
                      ) : (
                        pageTypes.map((pt) => (
                          <option key={pt.id} value={pt.id}>
                            {pt.index}
                          </option>
                        ))
                      )}
                    </select>
                  </FormField>
                </Col>
                <Col xs={12} md={6}>
                  <FormField label={t('pages.editPage.name')} error={errors.name?.message} required>
                    <Input
                      type="text"
                      {...register('name')}
                      placeholder={t('pages.editPage.namePlaceholder')}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </Col>
                <Col xs={12} md={6}>
                  <FormField label={t('pages.editPage.path')} error={errors.path?.message} required>
                    <Input
                      type="text"
                      {...register('path')}
                      placeholder={t('pages.editPage.pathPlaceholder')}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </Col>
                <Col xs={12} md={6}>
                  <FormField
                    label={t('pages.editPage.index')}
                    error={errors.index?.message}
                    required
                  >
                    <Input
                      type="number"
                      {...register('index', { valueAsNumber: true })}
                      placeholder={t('pages.editPage.indexPlaceholder')}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </Col>
                <Col xs={12}>
                  <FormField
                    label={t('pages.editPage.description')}
                    error={errors.description?.message}
                  >
                    <Input
                      type="text"
                      {...register('description')}
                      placeholder={t('pages.editPage.descriptionPlaceholder')}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </Col>
              </Row>

              <div className="page-form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(getLocalizedPath(`/faces/${page.faceId}`))}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('pages.editPage.submitting') : t('pages.editPage.submit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
