
      SELECT 
        metric_name,
        metric_value,
        metric_category,
        time_period
      FROM platform_analytics
      WHERE 
        COALESCE(:param0, '') = ''
        OR metric_category = :param1
      ORDER BY recorded_at DESC;
    