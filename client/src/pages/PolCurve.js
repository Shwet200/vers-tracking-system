import { useState } from "react";
import { CartesianGrid, Label, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";

export default function PolCurve(props) {
    const [xStart, setXStart] = useState(0.0);
    const [yStart, setYStart] = useState(0.0);

    return <div>
        <h2>&nbsp;Pol Curve</h2>

        <ScatterChart
            width={500}
            height={500}
            margin={{
                right: 20, bottom: 30, left: 20,
            }}
        >
            <CartesianGrid />
            <XAxis type="number" domain={[0, 2.0]} ticks={[0.0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2.0]} dataKey="Current Density(A/cm2)">
                <Label value="Current Density(A/cm²)" offset={-20} position="insideBottom" style={{ fontSize: 20 }} />
            </XAxis>
            <YAxis dataKey="Voltage per Cell(V)" type="number" allowDataOverflow="true" tickFormatter={(value) => value.toFixed(1)}>
                <Label value="Voltage per Cell(V)" angle={-90} style={{ fontSize: 20 }} dx={-20} />
            </YAxis>
            <Scatter data={props.myData} fill="#8884d8" />

            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        </ScatterChart>

        {/* <Segment>
        <Form>
            <Header as="h5">Scale Graph</Header>
            <Form.Group widths="inline">
                <Form.Input placeholder="Pick starting x: "/>
                <Form.Input placeholder="Pick starting y: "/>
            </Form.Group>
            <Button color="teal">Scale Form</Button>

        </Form>
        </Segment> */}
    </div>
}