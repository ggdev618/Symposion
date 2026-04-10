import {
  Root,
  RowDivider,
  Row,
  AvatarCircle,
  TextLines,
  TextLineShort,
  TextLineLong,
} from './LoadingDialogue.styled'

interface LoadingDialogueProps {
  memberCount: number
}

export function LoadingDialogue({ memberCount }: LoadingDialogueProps) {
  const rows = Array.from({ length: memberCount }, (_, i) => i)

  return (
    <Root>
      {rows.map((i) => (
        <div key={i}>
          {i > 0 && <RowDivider />}
          <Row>
            {/* Avatar circle */}
            <AvatarCircle
              style={{ animationDelay: `${i * 150}ms` }}
            />
            {/* Text lines */}
            <TextLines>
              <TextLineShort
                style={{
                  width: `${30 + (i % 3) * 10}%`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
              <TextLineLong
                style={{
                  width: `${60 + (i % 2) * 20}%`,
                  animationDelay: `${i * 150 + 75}ms`,
                }}
              />
            </TextLines>
          </Row>
        </div>
      ))}
    </Root>
  )
}
