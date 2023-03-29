select
    hop,
    ip,
    avg(rtt),
    stddev(rtt),
    count(*)
from
    public."TracepathHop"
group by
    ip,
    hop
order by
    hop,
    ip;